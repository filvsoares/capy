import { Invalid, ParseError } from '@/base';
import { Token } from '@/modules/parser/tokenizer/token';
import { TokenizerContext } from '@/modules/parser/tokenizer/tokenizer-context';
import { declareBeanInterface } from '@/util/beans';

export interface TokenizerResult {
  tokenList: Token[];
  errors: ParseError[];
}

export interface Tokenizer {
  readToken(c: TokenizerContext): Token | true | Invalid;
  process(s: string): TokenizerResult;
}

export const tokenizer = declareBeanInterface<Tokenizer>('Tokenizer');
