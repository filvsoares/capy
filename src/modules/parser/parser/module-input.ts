import { ExtraHandler, ExtraKey } from '@/util/extra';

export class ModuleInput {
  constructor(public name: string, public sourceCode: string) {}

  private _extra = new ExtraHandler();
  get extra() {
    return this._extra;
  }

  withExtra<T>(key: ExtraKey<T>, value: T) {
    this._extra.put(key, value);
    return this;
  }
}
