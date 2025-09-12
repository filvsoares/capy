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
  name: string;
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
      const containers = registry[i.key] ?? {};
      for (const name in containers) {
        loader.load(containers[name]);
      }
    },
    resolve: () => {
      const containers = registry[i.key] ?? {};
      return Object.keys(containers)
        .map((name) => internalGetBean(containers[name]))
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)) as (Bean & T)[];
    },
  };
}

export function one<T>(i: BeanInterface<T>, name?: string): BeanDependencySpec<(Bean & T) | null> {
  return {
    load: (loader) => {
      if (name) {
        const container = (registry[i.key] ?? {})?.[name];
        if (container) {
          loader.load(container);
        }
      } else {
        const containers = registry[i.key] ?? {};
        for (const name in containers) {
          loader.load(containers[name]);
        }
      }
    },
    resolve: () => {
      if (name) {
        const container = (registry[i.key] ?? {})?.[name];
        return container ? (internalGetBean(container) as Bean & T) : null;
      } else {
        const containers = registry[i.key] ?? {};
        const names = Object.keys(containers);
        if (names.length > 1) {
          throw new Error(
            `Several beans declared for interface '${i.key.description}' ('${names.join(
              `', '`
            )}') but one has been requested.`
          );
        }
        return internalGetBean(containers[names[0]]) as Bean & T;
      }
    },
  };
}

export function single<T>(i: BeanInterface<T>, name?: string): BeanDependencySpec<Bean & T> {
  const { load, resolve } = one(i, name);
  return {
    load,
    resolve() {
      const result = resolve();
      if (!result) {
        throw new Error(`No beans declared for interface '${i.key.description}'${name ? ` and name '${name}'` : ''}`);
      }
      return result;
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
  [key: symbol]: { [name: string]: BeanContainer };
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
        console.log(`Loading "${bc.name}"...`);
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

export async function getOneBean<T>(i: BeanInterface<T>, name?: string): Promise<(Bean & T) | null> {
  return await loadAndResolve(one(i, name));
}

export async function getSingleBean<T>(i: BeanInterface<T>, name?: string): Promise<Bean & T> {
  return await loadAndResolve(single(i, name));
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
    name,
    key: Symbol(),
    dependencies,
    loadModule,
    factory: factory as (module: Module, dependencies: any[]) => Bean,
  };
  for (const provide of provides) {
    let registryKey = registry[provide.key];
    if (!registryKey) {
      registry[provide.key] = registryKey = {};
    }
    if (registryKey[name]) {
      throw new Error(`Bean with interface '${provide.key.description}' and name '${name}' already declared`);
    }
    registryKey[name] = bc;
  }
}
