export class Bean {
  _priority?: number;
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

type BeansOf<L extends BeanInterface<any>[]> = { [I in keyof L]: BeanList<InterfaceOf<L[I]>> };

export class BeanList<T = any> extends Array<Bean & T> {
  private loaded: boolean = false;
  private onLoadCallbacks: ((items: T[]) => void)[] = [];

  onLoad(callback: (items: T[]) => void) {
    if (this.loaded) {
      callback(this);
    } else {
      this.onLoadCallbacks.push(callback);
    }
  }

  triggerOnLoad() {
    this.loaded = true;
    for (const callback of this.onLoadCallbacks) {
      callback(this);
    }
    this.onLoadCallbacks = [];
  }
}

type BeanCreator<Module extends {} = any> = {
  key: symbol;
  consumes: BeanInterface<any>[];
  loadModule: () => Promise<Module>;
  factory: (module: Module, deps: BeanList[]) => Bean;
  loadModulePromise?: Promise<Module>;
  module?: Module;
};

const registry: {
  [key: symbol]: {
    creators: BeanCreator[];
    beans?: BeanList;
  };
} = {};

function internalLoadModules(
  interfaceKey: symbol,
  processedCreators: Set<symbol>,
  loadModulePromises: Promise<void>[]
) {
  console.log(`internalLoadModules(${String(interfaceKey)})`);
  for (const creator of registry[interfaceKey]?.creators ?? []) {
    if (processedCreators.has(creator.key)) {
      console.log(`  creator ${String(creator.key)} already processed`);
      continue;
    }
    console.log(`  creator ${String(creator.key)}`);
    processedCreators.add(creator.key);

    if (!creator.loadModulePromise) {
      creator.loadModulePromise = (async () => {
        await Promise.resolve();
        creator.module = await creator.loadModule();
      })();
    }
    loadModulePromises.push(creator.loadModulePromise);

    for (const consume of creator.consumes) {
      internalLoadModules(consume.key, processedCreators, loadModulePromises);
    }
  }
}

function internalGetBeans(interfaceKey: symbol): BeanList {
  console.log(`internalGetBeans(${String(interfaceKey)})`);

  let registryKey = registry[interfaceKey];
  if (!registryKey) {
    registry[interfaceKey] = registryKey = { creators: [] };
  }

  let beans = registryKey.beans;
  if (beans) {
    console.log(`already has, returning ${beans.length} item(s)`);
    return beans;
  }

  console.log(`will create`);

  registryKey.beans = beans = new BeanList();
  for (const creator of registryKey.creators) {
    beans.push(
      creator.factory(
        creator.module!,
        creator.consumes.map((i) => internalGetBeans(i.key))
      )
    );
  }
  beans.sort((a, b) => (b._priority ?? 0) - (a._priority ?? 0));
  beans.triggerOnLoad();

  console.log(`returning ${beans.length} item(s)`);
  return beans;
}

export async function getBeans<T>(i: BeanInterface<T>): Promise<(Bean & T)[]> {
  const processedCreators = new Set<symbol>();
  const loadModulePromises: Promise<void>[] = [];
  internalLoadModules(i.key, processedCreators, loadModulePromises);
  await Promise.all(loadModulePromises);
  return internalGetBeans(i.key) as (Bean & T)[];
}

export function declareBean<Provides extends BeanInterface[], Consumes extends BeanInterface[], Module extends {}>({
  name,
  provides,
  consumes,
  loadModule,
  factory,
}: {
  name: string;
  provides: [...Provides];
  consumes: [...Consumes];
  loadModule: () => Promise<Module>;
  factory: (module: Module, deps: BeansOf<Consumes>) => Bean & WithInterfaces<Provides>;
}) {
  const wrapper: BeanCreator<Module> = {
    key: Symbol(name),
    consumes,
    loadModule,
    factory: factory as (module: Module, deps: BeanList[]) => Bean,
  };
  for (const provide of provides) {
    let registryKey = registry[provide.key];
    if (!registryKey) {
      registry[provide.key] = registryKey = { creators: [] };
    }
    if (registryKey.beans) {
      throw new Error(`getBeans() already performed on key '${provide.key.description}'`);
    }
    registryKey.creators.push(wrapper);
  }
}
