import { i as INTERNAL } from "./index-DyTq3Mxn.js";
import { T as Type } from "./type-Cw01Jon0.js";
class SimpleType extends Type {
  constructor(primitive, pos) {
    super(pos);
    this.primitive = primitive;
  }
  toString() {
    return `${this.primitive}`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  primitive: ${this.primitive}
`);
  }
}
const STRING = new SimpleType("string", INTERNAL);
const NUMBER = new SimpleType("number", INTERNAL);
new SimpleType("boolean", INTERNAL);
const VOID = new SimpleType("void", INTERNAL);
function isStringType(type) {
  return type instanceof SimpleType && type.primitive === "string";
}
function isVoidType(type) {
  return type instanceof SimpleType && type.primitive === "void";
}
export {
  NUMBER as N,
  STRING as S,
  VOID as V,
  isStringType as a,
  SimpleType as b,
  isVoidType as i
};
