import { Token } from '@/beans/tokenizer/token';
import { TokenizerContext } from '@/beans/tokenizer/tokenizer-context';
import { declareBeanInterface } from '@/util/beans';

export interface TokenReader {
  read(c: TokenizerContext): Token | true | undefined;
}

export const tokenReader = declareBeanInterface<TokenReader>('TokenReader');
