import { Token } from '@/modules/tokenizer/token';
import { TokenizerContext } from '@/modules/tokenizer/tokenizer-context';
import { declareBeanInterface } from '@/util/beans';

export interface TokenReader {
  read(c: TokenizerContext): Token | true | undefined;
}

export const tokenReader = declareBeanInterface<TokenReader>('TokenReader');
