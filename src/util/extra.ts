export type ExtraKey<T> = {
  key: symbol;
  type?: T;
};

export function declareExtraKey<T>(): ExtraKey<T> {
  return { key: Symbol() };
}

export class ExtraHandler {
  private extras: { [key: symbol]: any } = {};

  put<T>(key: ExtraKey<T>, value: T) {
    this.extras[key.key] = value;
  }

  get<T>(key: ExtraKey<T>): T | undefined {
    return this.extras[key.key];
  }

  getOrCreate<T>(key: ExtraKey<T>, factory: () => T): T {
    let val = this.extras[key.key];
    if (val === undefined) {
      this.extras[key.key] = val = factory();
    }
    return val;
  }
}
