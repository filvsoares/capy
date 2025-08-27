import { ParseError } from '@/base';
import { Symbol } from '@/beans/parser/symbol';
import { Token } from '@/beans/tokenizer/token';

export class ParserContext {
  private pos = 0;

  current: Token | undefined;
  extra: { [key: symbol]: any } = {};

  constructor(
    public modules: { [moduleName: string]: { [symbolName: string]: Symbol } },
    public moduleName: string,
    private tokenList: Token[],
    private errors: ParseError[]
  ) {
    this.current = tokenList[0];
  }

  addError(e: ParseError) {
    this.errors.push(e);
  }

  consume() {
    this.current = this.tokenList[++this.pos];
  }

  derive(tokenList: Token[]) {
    return new ParserContext(this.modules, this.moduleName, tokenList, this.errors);
  }
}
