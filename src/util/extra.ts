export function declareExtraKey<T>(name?: string) {
  const key = Symbol(name);
  return {
    key,
    wrap(value: T) {
      return { [key]: value };
    },
    addTo(obj: {}, value: T) {
      (obj as any)[key] = value;
    },
    requireFrom(obj: {}) {
      const result = (obj as any)[key];
      if (result === undefined) {
        throw new Error(`Object does not have required extra '${key.description}'`);
      }
      return result as T;
    },
    optionalFrom(obj: {}) {
      return (obj as any)[key] as T | undefined;
    },
  };
}
