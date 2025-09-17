import { h as Base, i as INTERNAL, E as ERROR, B as Bean } from "./index-DyTq3Mxn.js";
import { S as Symbol$1 } from "./symbol-B09mnHSj.js";
import { T as TokenReader } from "./token-reader-CWKbD-VP.js";
class Application extends Base {
  constructor(symbols) {
    super(INTERNAL);
    this.symbols = symbols;
  }
  toString() {
    return "application";
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
class ParserData {
  constructor(inputs, modulesToProcess, outputs, tasks) {
    this.inputs = inputs;
    this.modulesToProcess = modulesToProcess;
    this.outputs = outputs;
    this.tasks = tasks;
  }
  getInput(moduleName) {
    return this.inputs[moduleName];
  }
  addInput(input) {
    this.inputs[input.name] = input;
  }
  processModule(moduleName) {
    this.modulesToProcess.push(moduleName);
  }
  findSymbol(moduleName, symbolName) {
    var _a;
    return (_a = this.outputs[moduleName]) == null ? void 0 : _a[symbolName];
  }
  replaceSymbol(obj) {
    this.outputs[obj.module][obj.name] = obj;
  }
  addTask(task) {
    this.tasks.push(task);
  }
}
class ParseErrors {
  constructor(errors) {
    this.errors = errors;
  }
  addError(message, pos = INTERNAL) {
    this.errors.push({ level: ERROR, message, pos });
  }
}
class ParserImpl extends Bean {
  constructor(tokenizer, toplevelReaders, parserHooks) {
    super();
    this.tokenizer = tokenizer;
    this.toplevelReaders = toplevelReaders;
    this.parserHooks = parserHooks;
  }
  async parse(_inputs) {
    var _a;
    const inputs = {};
    for (const input of _inputs) {
      inputs[input.name] = input;
    }
    const modulesToProcess = ["main"];
    const outputs = {};
    const tasks = [];
    const c = {
      parserData: new ParserData(inputs, modulesToProcess, outputs, tasks),
      parseErrors: new ParseErrors([])
    };
    for (const hook of this.parserHooks) {
      if (hook.onCreateContext) {
        hook.onCreateContext(c);
      }
    }
    while (modulesToProcess.length > 0) {
      const moduleName = modulesToProcess.pop();
      let symbols = outputs[moduleName];
      if (symbols) {
        continue;
      }
      symbols = outputs[moduleName] = {};
      const input = inputs[moduleName];
      if (!input) {
        throw new Error(`Module "${moduleName}" not found`);
      }
      const r = this.tokenizer.process(input.sourceCode);
      c.parseErrors.errors.push(...r.errors);
      const result = await this.readToplevelList({
        ...c,
        tokenReader: new TokenReader(r.tokenList),
        currentModule: moduleName
      });
      for (const symbol of result) {
        if (symbols[symbol.name]) {
          c.parseErrors.addError(`Symbol '${symbol.name}' already defined in module '${moduleName}'`, symbol.pos);
        } else {
          symbols[symbol.name] = symbol;
        }
      }
    }
    while (tasks.length > 0) {
      const _tasks = tasks.splice(0, tasks.length);
      for (const task of _tasks) {
        task();
      }
    }
    for (const hook of this.parserHooks) {
      (_a = hook.onCheckOutputs) == null ? void 0 : _a.call(hook, c);
    }
    return {
      application: new Application(Object.values(outputs).flatMap((symbols) => Object.values(symbols))),
      errors: c.parseErrors.errors
    };
  }
  async readToplevel(c) {
    for (const reader of this.toplevelReaders) {
      const result = await reader.read(c);
      if (result) {
        return result;
      }
    }
  }
  async readToplevelList(c) {
    const symbols = [];
    while (true) {
      const t = c.tokenReader.current;
      if (!t) {
        break;
      }
      const val = await this.readToplevel(c);
      if (!val) {
        c.parseErrors.addError(`Unexpected ${t}`, t.pos);
        c.tokenReader.consume();
        continue;
      }
      if (val instanceof Symbol$1) {
        symbols.push(val);
      }
    }
    return symbols;
  }
}
export {
  ParserImpl
};
