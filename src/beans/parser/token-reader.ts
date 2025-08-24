import { TokenizerContext } from '@/beans/parser/parser';
import { Token } from '@/beans/parser/token';
import { declareBeanInterface } from '@/util/beans';

export interface TokenReader {
  read(c: TokenizerContext): Token | true | undefined;
}

export const tokenReader = declareBeanInterface<TokenReader>('TokenReader');
