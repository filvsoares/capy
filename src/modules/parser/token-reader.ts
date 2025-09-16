import { Token } from '@/modules/tokenizer/token';

export class TokenReader {
  current: Token | undefined;
  pos = 0;

  constructor(private tokenList: Token[]) {
    this.current = tokenList[0];
  }

  consume() {
    this.current = this.tokenList[++this.pos];
  }
}
