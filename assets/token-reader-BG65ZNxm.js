function tokenReader(tokenList) {
  let pos = 0;
  return {
    tokenReader: {
      current: tokenList[0],
      consume() {
        this.current = tokenList[++pos];
      }
    }
  };
}
export {
  tokenReader as t
};
