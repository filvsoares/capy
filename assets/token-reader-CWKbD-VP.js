class TokenReader {
  constructor(tokenList) {
    this.tokenList = tokenList;
    this.pos = 0;
    this.current = tokenList[0];
  }
  consume() {
    this.current = this.tokenList[++this.pos];
  }
}
export {
  TokenReader as T
};
