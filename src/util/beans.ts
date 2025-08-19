export class Bean {
  priority?: number;
}

export type BeanInterface<T = {}> = {
  key: symbol;
  interface?: T;
};

export function declareBeanInterface<T = {}>(name: string): BeanInterface<T> {
  return { key: Symbol(name) };
}

type InterfaceOf<K> = K extends BeanInterface<infer T> ? T : never;

type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

type WithInterfaces<T extends BeanInterface<any>[]> = UnionToIntersection<InterfaceOf<T[number]>>;

type BeanContainer<Module extends {} = any> = {
  bean?: Bean;
  key: symbol;
  dependencies: BeanDependencySpec[];
  loadModule: () => Promise<Module>;
  factory: (module: Module, dependencies: any[]) => Bean;
  loadModulePromise?: Promise<Module>;
  module?: Module;
};

type BeanDependencySpec<T = any> = {
  load: (loader: BeanLoader) => void;
  resolve: () => T;
};

type DependencyOf<K> = K extends BeanDependencySpec<infer T> ? T : never;

type DependenciesOf<L extends BeanDependencySpec[]> = { [I in keyof L]: DependencyOf<L[I]> };

export function list<T>(i: BeanInterface<T>): BeanDependencySpec<(Bean & T)[]> {
  return {
    load: (loader) => {
      for (const bc of registry[i.key] ?? []) {
        loader.load(bc);
      }
    },
    resolve: () => {
      const result = (registry[i.key] ?? [])
        .map((bc) => internalGetBean(bc))
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
      return result as (Bean & T)[];
    },
  };
}

export function single<T>(i: BeanInterface<T>): BeanDependencySpec<Bean & T> {
  return {
    load: (loader) => {
      for (const bc of registry[i.key] ?? []) {
        loader.load(bc);
      }
    },
    resolve: () => {
      const result = (registry[i.key] ?? [])
        .map((bc) => internalGetBean(bc))
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
      return result[0] as Bean & T;
    },
  };
}

async function loadAndResolve<T>(spec: BeanDependencySpec<T>): Promise<T> {
  const loader = new BeanLoader();
  spec.load(loader);
  await loader.getPromise();
  return spec.resolve();
}

const registry: {
  [key: symbol]: BeanContainer[];
} = {};

class BeanLoader {
  private promises: Promise<void>[] = [];
  private processedBCs = new Set<symbol>();

  load(bc: BeanContainer) {
    if (this.processedBCs.has(bc.key)) {
      return;
    }
    this.processedBCs.add(bc.key);
    if (!bc.module) {
      if (!bc.loadModulePromise) {
        console.log(`Loading "${bc.key.description}"...`);
        bc.loadModulePromise = (async () => {
          await Promise.resolve();
          bc.module = await bc.loadModule();
        })();
      }
      this.promises.push(bc.loadModulePromise);
    }
    for (const dep of bc.dependencies) {
      dep.load(this);
    }
  }

  getPromise() {
    return Promise.all(this.promises);
  }
}

function internalGetBean(bc: BeanContainer) {
  if (bc.bean) {
    return bc.bean;
  }
  const dst = (bc.bean = {});
  const src = bc.factory(
    bc.module!,
    bc.dependencies.map((dep) => dep.resolve())
  );
  Object.setPrototypeOf(dst, Object.getPrototypeOf(src));
  Object.defineProperties(dst, Object.getOwnPropertyDescriptors(src));
  return bc.bean;
}

export async function getBeans<T>(i: BeanInterface<T>): Promise<(Bean & T)[]> {
  return await loadAndResolve(list(i));
}

export function declareBean<
  Provides extends BeanInterface[],
  Dependencies extends BeanDependencySpec[],
  Module extends {}
>({
  name,
  provides,
  dependencies,
  loadModule,
  factory,
}: {
  name: string;
  provides: [...Provides];
  dependencies: [...Dependencies];
  loadModule: () => Promise<Module>;
  factory: (module: Module, dependencies: DependenciesOf<Dependencies>) => Bean & WithInterfaces<Provides>;
}) {
  const bc: BeanContainer<Module> = {
    key: Symbol(name),
    dependencies,
    loadModule,
    factory: factory as (module: Module, dependencies: any[]) => Bean,
  };
  for (const provide of provides) {
    let registryKey = registry[provide.key];
    if (!registryKey) {
      registry[provide.key] = registryKey = [];
    }
    registryKey.push(bc);
  }
}
