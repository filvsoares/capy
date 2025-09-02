import { Token } from '@/modules/parser/tokenizer/token';
import { ContextValue } from '@/util/context';

export type TokenReader = ContextValue<
  'tokenReader',
  {
    current: Token | undefined;
    consume(): void;
  }
>;

export function tokenReader(tokenList: Token[]): TokenReader {
  let pos = 0;
  return {
    tokenReader: {
      current: tokenList[0],
      consume() {
        this.current = tokenList[++pos];
      },
    },
  };
}
