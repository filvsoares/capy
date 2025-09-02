import { ExtraHandler } from '@/util/extra';

export class CodegenContext {
  constructor(private out: string[], private _extra: ExtraHandler) {}

  get extra() {
    return this._extra;
  }

  write(...s: string[]) {
    this.out.push(...s);
  }
}
