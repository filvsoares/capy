import { ERROR, INVALID, Invalid, ParseError } from '@/base';
import { Token } from '@/beans/tokenizer/token';
import { TokenReader } from '@/beans/tokenizer/token-reader';
import { Tokenizer, TokenizerResult } from '@/beans/tokenizer/tokenizer';
import { TokenizerContext } from '@/beans/tokenizer/tokenizer-context';
import { Bean } from '@/util/beans';

export class TokenizerImpl extends Bean implements Tokenizer {
  constructor(private tokenReaders: TokenReader[]) {
    super();
  }

  readToken(c: TokenizerContext): Token | true | Invalid {
    for (const reader of this.tokenReaders) {
      const item = reader.read(c);
      if (item) {
        return item;
      }
    }
    c.addError({
      level: ERROR,
      message: `Unexpected char "${c.current}"`,
      pos: { lin1: c.lin, col1: c.col, lin2: c.lin, col2: c.col + 1 },
    });
    c.consume();
    return INVALID;
  }

  process(s: string): TokenizerResult {
    const tokenList: Token[] = [];
    const errors: ParseError[] = [];
    const c = new TokenizerContext(s, errors);
    while (c.current) {
      const token = this.readToken(c);
      if (token instanceof Token) {
        tokenList.push(token);
      }
    }
    return { tokenList, errors };
  }
}
