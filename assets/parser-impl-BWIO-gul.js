import { b as Base, e as INTERNAL, E as ERROR, B as Bean, I as INVALID } from "./index-BncJlCxS.js";
import { S as Symbol$1 } from "./symbol-CzF83rwI.js";
import { t as tokenReader } from "./token-reader-BG65ZNxm.js";
import { c as createContext } from "./context-ByTyzBz7.js";
class Application extends Base {
  constructor(mainModuleName, symbols) {
    super(INTERNAL);
    this.mainModuleName = mainModuleName;
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
function currentModule(name) {
  return { currentModule: name };
}
function parserData(mainModuleName, inputs, outputs, tasks) {
  return {
    parserData: {
      mainModuleName,
      getInput(moduleName) {
        return inputs[moduleName];
      },
      getOutput(moduleName) {
        return outputs[moduleName];
      },
      putOutput(moduleName, symbols) {
        outputs[moduleName] = symbols;
      },
      addTask(task) {
        tasks.push(task);
      }
    }
  };
}
function parseErrors(errors) {
  return {
    parseErrors: {
      errors,
      addError(message, pos = INTERNAL) {
        errors.push({ level: ERROR, message, pos });
      }
    }
  };
}
class ParserImpl extends Bean {
  constructor(tokenizer, toplevelReaders, parserChecks) {
    super();
    this.tokenizer = tokenizer;
    this.toplevelReaders = toplevelReaders;
    this.parserChecks = parserChecks;
  }
  parseModule(c, moduleName) {
    if (c.parserData.getOutput(moduleName)) {
      return;
    }
    const input = c.parserData.getInput(moduleName);
    if (!input) {
      throw new Error(`Module "${moduleName}" not found`);
    }
    const r = this.tokenizer.process(input.sourceCode);
    c.parseErrors.errors.push(...r.errors);
    const symbols = this.readToplevelList(c.with(tokenReader(r.tokenList)).with(currentModule(moduleName)));
    c.parserData.putOutput(moduleName, symbols);
  }
  parse(mainModuleName, _inputs) {
    const inputs = {};
    for (const input of _inputs) {
      inputs[input.name] = input;
    }
    const outputs = {};
    const tasks = [];
    const c = createContext({}).with(parserData(mainModuleName, inputs, outputs, tasks)).with(parseErrors([]));
    this.parseModule(c, mainModuleName);
    while (tasks.length > 0) {
      const _tasks = tasks.splice(0, tasks.length);
      for (const task of _tasks) {
        task();
      }
    }
    for (const check of this.parserChecks) {
      check.checkOutputs(c);
    }
    return {
      application: new Application(
        mainModuleName,
        Object.values(outputs).flatMap((module) => Object.values(module))
      ),
      errors: c.parseErrors.errors
    };
  }
  readToplevel(c) {
    for (const reader of this.toplevelReaders) {
      const result = reader.read(c);
      if (result) {
        return result;
      }
    }
    const t = c.tokenReader.current;
    c.parseErrors.addError(`Unexpected ${t}`, t.pos);
    c.tokenReader.consume();
    return INVALID;
  }
  readToplevelList(c) {
    const symbols = {};
    while (c.tokenReader.current) {
      const val = this.readToplevel(c);
      if (val instanceof Symbol$1) {
        if (symbols[val.name]) {
          c.parseErrors.addError(`Symbol "${val.name}" already defined`, val.pos);
        } else {
          symbols[val.name] = val;
        }
      }
    }
    return symbols;
  }
  findSymbol(c, symbolName) {
    const module = c.parserData.getOutput(c.currentModule);
    if (!module) {
      throw new Error("findSymbol() must be used within a task");
    }
    return module[symbolName];
  }
  replaceSymbol(c, newSymbol) {
    const module = c.parserData.getOutput(c.currentModule);
    if (!module) {
      throw new Error("replaceSymbol() must be used within a task");
    }
    module[newSymbol.name] = newSymbol;
  }
}
export {
  ParserImpl
};
