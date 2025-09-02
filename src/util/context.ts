export type ContextValue<K extends string = any, V = any> = { [key in K]: V };

export type Context<T extends ContextValue> = T & {
  with<U extends ContextValue>(value: U): Context<T & U>;
};

export function createContext<T extends ContextValue>(data: T): Context<T> {
  return {
    ...data,
    with: <U extends ContextValue>(value: U): Context<T & U> => createContext({ ...data, ...value }),
  };
}
