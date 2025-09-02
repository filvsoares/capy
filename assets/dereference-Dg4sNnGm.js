function dereference() {
  return { dereference: true };
}
function hasDereference(c) {
  return c.dereference === true;
}
export {
  dereference as d,
  hasDereference as h
};
