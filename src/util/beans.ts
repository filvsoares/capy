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

type Provided<T extends Array<BeanInterface<any>>> = UnionToIntersection<InterfaceOf<T[number]>>;

type BeanWrapper = {
  factory: (r: BeanResolver) => Promise<Bean>;
  resolver?: Promise<void>;
  resolved?: Bean;
};

const registry: {
  [key: symbol]: {
    wrappers: BeanWrapper[];
    resolver?: Promise<void>;
    resolved: Bean[];
  };
} = {};

export class BeanResolver {
  stack: Set<symbol> = new Set();

  async getBeans<T>(i: BeanInterface<T>): Promise<(Bean & T)[]> {
    console.log(`getBeans(${String(i.key)})`);

    if (this.stack.has(i.key)) {
      console.log(`In stack, getting potentially incomplete version`);
      return registry[i.key].resolved as (Bean & T)[];
    }

    console.log(`Will resolve`);
    this.stack.add(i.key);
    try {
      const registryKey = registry[i.key];

      if (!registryKey.resolver) {
        registryKey.resolver = (async () => {
          await Promise.resolve();
          const wrapperResolvers: Promise<void>[] = [];
          for (const wrapper of registryKey.wrappers) {
            if (!wrapper.resolver) {
              wrapper.resolver = (async () => {
                await Promise.resolve();
                wrapper.resolved = await wrapper.factory(this);
              })();
            }
            wrapperResolvers.push(wrapper.resolver);
          }
          await Promise.all(wrapperResolvers);
          for (const wrapper of registryKey.wrappers) {
            registryKey.resolved.push(wrapper.resolved!);
          }
          registryKey.resolved.sort((a, b) => (b._priority ?? 0) - (a._priority ?? 0));
        })();
      }
      await registryKey.resolver;
    } finally {
      this.stack.delete(i.key);
    }
    return registry[i.key].resolved as (Bean & T)[];
  }
}

export function declareBean<K extends Array<BeanInterface>, T extends Provided<K>>(
  provides: K,
  factory: (r: BeanResolver) => Promise<Bean & T>
) {
  const wrapper: BeanWrapper = {
    factory,
  };
  for (const provide of provides) {
    let list = registry[provide.key];
    if (!list) {
      registry[provide.key] = list = { wrappers: [], resolved: [] };
    }
    list.wrappers.push(wrapper);
  }
}
