import { m as methodExtraKey } from "./method-extra-DbSJTGU1.js";
import { E as ExtraHandler } from "./extra-DGWX4UcI.js";
import { B as Bean, I as INTERNAL, E as ERROR } from "./index-s97_hl8g.js";
class ModuleInput {
  constructor(sourceCode) {
    this.sourceCode = sourceCode;
    this._extra = new ExtraHandler();
  }
  get extra() {
    return this._extra;
  }
  withExtra(key, value) {
    this._extra.put(key, value);
    return this;
  }
}
const nativeMethods = {
  print(runner, s) {
    runner.print(s);
  }
};
class CompilerImpl extends Bean {
  constructor(parser) {
    super();
    this.parser = parser;
  }
  compile(sourceCode, { debugTree }) {
    const errors = [];
    const out = [];
    let p;
    try {
      p = this.parser.parse({
        main: new ModuleInput(sourceCode).withExtra(methodExtraKey, { nativeMethods })
      });
      errors.push(...p.errors);
    } catch (err) {
      errors.push({ level: ERROR, message: err.stack, pos: INTERNAL });
    }
    if (errors.length === 0) {
      out.push("# Compile successful!\n");
    } else {
      out.push("# Compile errors:\n");
      errors.forEach(
        (item) => out.push(
          `- ${item.pos !== INTERNAL ? `[${item.pos.lin1}:${item.pos.col1}-${item.pos.lin2}:${item.pos.col2}] ` : ""}${item.message}
`
        )
      );
    }
    if (debugTree && p) {
      out.push("---\n");
      out.push("ParserResult:\n");
      Object.values(p.modules).forEach(
        (m) => Object.values(m.symbols).forEach((e) => {
          out.push("- ");
          e.debugPrint(out, "  ");
        })
      );
    }
    return {
      errors,
      output: out.join(""),
      modules: p == null ? void 0 : p.modules
    };
  }
}
export {
  CompilerImpl
};
