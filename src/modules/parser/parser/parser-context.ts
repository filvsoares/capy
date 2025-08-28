import { ParseError } from '@/base';
import { ModuleInput } from '@/modules/parser/parser/module-input';
import { Token } from '@/modules/parser/tokenizer/token';
import { ExtraHandler } from '@/util/extra';

export class ParserContext {
  private pos = 0;

  private _current: Token | undefined;
  get current() {
    return this._current;
  }

  get extra() {
    return this._extra;
  }

  get moduleName() {
    return this._moduleName;
  }

  get moduleInput() {
    return this._moduleInput;
  }

  constructor(
    private _moduleName: string,
    private _moduleInput: ModuleInput,
    private tokenList: Token[],
    private errors: ParseError[],
    private tasks: (() => void)[],
    private _extra: ExtraHandler
  ) {
    this._current = tokenList[0];
  }

  addTask(task: () => void) {
    this.tasks.push(task);
  }

  addError(e: ParseError) {
    this.errors.push(e);
  }

  consume() {
    this._current = this.tokenList[++this.pos];
  }

  derive(tokenList: Token[]) {
    return new ParserContext(this._moduleName, this._moduleInput, tokenList, this.errors, this.tasks, this.extra);
  }
}
