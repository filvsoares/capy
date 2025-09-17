import { B as Bean, E as ERROR, I as INVALID } from "./index-BPYk8cqz.js";
import { T as Token } from "./token-C93Hpdaz.js";
class TokenizerContext {
  constructor(s, errors) {
    this.s = s;
    this.errors = errors;
    this.pos = 0;
    this.lin = 1;
    this.col = 1;
    this.current = s[0];
  }
  addError(e) {
    this.errors.push(e);
  }
  consume() {
    if (!this.current) {
      return;
    }
    this.pos++;
    if (this.pos >= this.s.length) {
      this.current = "";
      return;
    }
    if (this.current === "\n") {
      this.col = 1;
      this.lin++;
    } else {
      this.col++;
    }
    this.current = this.s[this.pos];
  }
}
class TokenizerImpl extends Bean {
  constructor(tokenReaders) {
    super();
    this.tokenReaders = tokenReaders;
  }
  readToken(c) {
    for (const reader of this.tokenReaders) {
      const item = reader.read(c);
      if (item) {
        return item;
      }
    }
    c.addError({
      level: ERROR,
      message: `Unexpected char "${c.current}"`,
      pos: { lin1: c.lin, col1: c.col, lin2: c.lin, col2: c.col + 1 }
    });
    c.consume();
    return INVALID;
  }
  process(s) {
    const tokenList = [];
    const errors = [];
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
export {
  TokenizerImpl
};
