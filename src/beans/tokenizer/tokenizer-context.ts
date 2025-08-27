import { ParseError } from '@/base';

export class TokenizerContext {
  pos = 0;
  lin = 1;
  col = 1;
  current: string;

  constructor(private s: string, private errors: ParseError[]) {
    this.current = s[0];
  }
  addError(e: ParseError) {
    this.errors.push(e);
  }

  consume() {
    if (!this.current) {
      return;
    }
    this.pos++;
    if (this.pos >= this.s.length) {
      this.current = '';
      return;
    }
    if (this.current === '\n') {
      this.col = 1;
      this.lin++;
    } else {
      this.col++;
    }
    this.current = this.s[this.pos];
  }
}
