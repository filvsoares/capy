export type Component<T = {}> = {
  _priority?: number;
} & T;

export type ComponentEntry<T extends Component> = {
  key: symbol;
  value: T;
};

export type ComponentKey<T extends Component> = {
  key: symbol;
  entry: (c: T) => ComponentEntry<T>;
};

export function declareComponentKey<T extends Component>(): ComponentKey<T> {
  const key = Symbol();
  return {
    key,
    entry: (value) => ({ key, value }),
  };
}

const registry: Promise<{ default: ComponentEntry<any>[] }>[] = [];

let resolvedRegistry: { [key: symbol]: Component<any>[] } | undefined;

export function addComponentsToRegistry(...entries: Promise<{ default: ComponentEntry<any>[] }>[]) {
  if (resolvedRegistry) {
    throw new Error('Registry already resolved.');
  }
  registry.push(...entries);
}

async function resolveRegistry() {
  if (resolvedRegistry) {
    return resolvedRegistry;
  }

  const awaitedRegistry = await Promise.all(registry);
  resolvedRegistry = {};
  for (const group of awaitedRegistry) {
    for (const entry of group.default) {
      let list = resolvedRegistry[entry.key];
      if (!list) {
        resolvedRegistry[entry.key] = list = [];
      }
      list.push(entry.value);
    }
  }
  for (const key of Object.getOwnPropertySymbols(resolvedRegistry)) {
    resolvedRegistry[key].sort((a, b) => (b._priority ?? 0) - (a._priority ?? 0));
  }

  return resolvedRegistry;
}

export async function getComponents<T extends Component>(key: ComponentKey<T>): Promise<T[]> {
  return (await resolveRegistry())[key.key] as T[];
}
