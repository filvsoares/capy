import { e as Base, I as INTERNAL, B as Bean, E as ERROR, b as INVALID, p as Symbol$1 } from "./index-s97_hl8g.js";
import { E as ExtraHandler, d as declareExtraKey } from "./extra-DGWX4UcI.js";
class Module extends Base {
  constructor(name, symbols) {
    super(INTERNAL);
    this.name = name;
    this.symbols = symbols;
  }
  toString() {
    return "module";
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  symbols:
`);
    Object.values(this.symbols).forEach((val) => {
      out.push(`${prefix}    - `);
      val == null ? void 0 : val.debugPrint(out, `${prefix}      `);
    });
  }
}
class ParserContext {
  constructor(_moduleName, _moduleInput, tokenList, errors, tasks, _extra) {
    this._moduleName = _moduleName;
    this._moduleInput = _moduleInput;
    this.tokenList = tokenList;
    this.errors = errors;
    this.tasks = tasks;
    this._extra = _extra;
    this.pos = 0;
    this._current = tokenList[0];
  }
  get current() {
    return this._current;
  }
  get extra() {
    return this._extra;
  }
  get moduleName() {
    return this._moduleName;
  }
  get moduleInput() {
    return this._moduleInput;
  }
  addTask(task) {
    this.tasks.push(task);
  }
  addError(e) {
    this.errors.push(e);
  }
  consume() {
    this._current = this.tokenList[++this.pos];
  }
  derive(tokenList) {
    return new ParserContext(this._moduleName, this._moduleInput, tokenList, this.errors, this.tasks, this.extra);
  }
}
const parserExtraKey = declareExtraKey();
class ParserImpl extends Bean {
  constructor(tokenizer, toplevelReaders) {
    super();
    this.tokenizer = tokenizer;
    this.toplevelReaders = toplevelReaders;
  }
  parse(moduleInputs) {
    const modules = {};
    const errors = [];
    const tasks = [];
    const extra = new ExtraHandler();
    extra.put(parserExtraKey, { modules });
    for (const moduleName in moduleInputs) {
      const moduleInput = moduleInputs[moduleName];
      const r = this.tokenizer.process(moduleInput.sourceCode);
      errors.push(...r.errors);
      const c = new ParserContext(moduleName, moduleInput, r.tokenList, errors, tasks, extra);
      const symbols = this.readToplevelList(c);
      modules[moduleName] = new Module(moduleName, symbols);
    }
    while (tasks.length > 0) {
      const _tasks = tasks.splice(0, tasks.length);
      for (const task of _tasks) {
        task();
      }
    }
    return { modules, errors };
  }
  readToplevel(c) {
    for (const reader of this.toplevelReaders) {
      const result = reader.read(c);
      if (result) {
        return result;
      }
    }
    const t = c.current;
    c.addError({
      level: ERROR,
      message: `Unexpected ${t}`,
      pos: t.pos ?? INTERNAL
    });
    c.consume();
    return INVALID;
  }
  readToplevelList(c) {
    const symbols = {};
    while (c.current) {
      const val = this.readToplevel(c);
      if (val instanceof Symbol$1) {
        if (symbols[val.name]) {
          c.addError({ level: ERROR, message: `Symbol "${val.name}" already defined`, pos: val.pos });
        } else {
          symbols[val.name] = val;
        }
      }
    }
    return symbols;
  }
  findSymbol(c, symbolName) {
    const module = c.extra.get(parserExtraKey).modules[c.moduleName];
    if (!module) {
      throw new Error("findSymbol() must be used within a task");
    }
    return module.symbols[symbolName];
  }
  replaceSymbol(c, newSymbol) {
    const module = c.extra.get(parserExtraKey).modules[c.moduleName];
    if (!module) {
      throw new Error("replaceSymbol() must be used within a task");
    }
    module.symbols[newSymbol.name] = newSymbol;
  }
  findModule(c, moduleName) {
    var _a;
    return (_a = c.extra.get(parserExtraKey)) == null ? void 0 : _a.modules[moduleName];
  }
}
export {
  ParserImpl
};
