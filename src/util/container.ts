type TypedSymbol<T = any> = symbol & { type?: T };
function declareContainerKey<T>(): TypedSymbol<T> {
  return Symbol();
}

function assertContainer<T extends TypedSymbol[]>(
  obj: {},
  ...keys: [...T]
): asserts obj is { [K in T[number]]: K extends TypedSymbol<infer U> ? U : never } {}
