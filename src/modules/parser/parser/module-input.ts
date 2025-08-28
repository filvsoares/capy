import { ExtraHandler, ExtraKey } from '@/util/extra';

export class ModuleInput {
  private _extra = new ExtraHandler();
  get extra() {
    return this._extra;
  }

  constructor(public sourceCode: string) {}

  withExtra<T>(key: ExtraKey<T>, value: T) {
    this._extra.put(key, value);
    return this;
  }
}
