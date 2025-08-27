import { ParseError } from '@/base';
import { Symbol as _Symbol } from '@/beans/parser/symbol';
import { Token } from '@/beans/tokenizer/token';

export class ExtraKey<T> {
  type?: T;
  key: symbol = Symbol();
}

export class ParserContext {
  private pos = 0;

  current: Token | undefined;
  private extra: { [key: symbol]: any } = {};

  constructor(
    public modules: { [moduleName: string]: { [symbolName: string]: _Symbol } },
    public moduleName: string,
    private tokenList: Token[],
    private errors: ParseError[],
    private tasks: (() => void)[]
  ) {
    this.current = tokenList[0];
  }

  addTask(task: () => void) {
    this.tasks.push(task);
  }

  putExtra<T>(key: ExtraKey<T>, value: T) {
    this.extra[key.key] = value;
  }

  getExtra<T>(key: ExtraKey<T>): T | undefined {
    return this.extra[key.key];
  }

  getOrCreateExtra<T>(key: ExtraKey<T>, factory: () => T): T {
    let val = this.extra[key.key];
    if (val === undefined) {
      this.extra[key.key] = val = factory();
    }
    return val;
  }

  addError(e: ParseError) {
    this.errors.push(e);
  }

  consume() {
    this.current = this.tokenList[++this.pos];
  }

  derive(tokenList: Token[]) {
    return new ParserContext(this.modules, this.moduleName, tokenList, this.errors, this.tasks);
  }
}
