import { Base } from './base';
import { L2Base, L2Identifier, L2Method, L2Operation, L2Use, L2Variable } from './l2-types';
import {
  L3Definition,
  L3Library,
  L3Method,
  L3Type,
  L3Variable,
  Runnable as L3Runnable,
  L3Statement,
  L3Operation,
  L3OperationStep,
  L3Base,
  L3Identifier,
} from './l3-types';
import { indent } from './util';

function checkType(name: string): L3Type {
  if (name === 'string' || name === 'number') {
    return name;
  }
  throw new Error(`Unknown type "${name}"`);
}

export function link(list: L2Base[], libs: { [name: string]: L3Library }) {
  const symbols: { [name: string]: L3Definition } = {};
  const deferredTasks: (() => void)[] = [];
  for (const item of list) {
    if (item instanceof L2Use) {
      const lib = libs[item.value];
      if (!lib) {
        throw new Error(`Library "${item.value}" not found`);
      }
      for (const def in lib.exported) {
        if (symbols[def]) {
          throw new Error(`Symbol already defined "${def}"`);
        }
        symbols[def] = lib.exported[def];
      }
    } else if (item instanceof L2Variable) {
      if (symbols[item.name]) {
        throw new Error(`Symbol already defined "${item.name}"`);
      }
      symbols[item.name] = new L3Variable(checkType(item.type.name));
    } else if (item instanceof L2Method) {
      if (symbols[item.name]) {
        throw new Error(`Symbol already defined "${item.name}"`);
      }
      const method = new L3Method(item.returnType && checkType(item.returnType.name), []);
      symbols[item.name] = method;
      deferredTasks.push(() => {
        processStatements(method, item, symbols);
      });
    } else {
      throw new Error(`Unexpected ${item.toString()}`);
    }
  }
  for (const task of deferredTasks) {
    task();
  }
  return new L3Runnable(symbols);
}

function processStatements(method: L3Method, origin: L2Method, symbols: { [name: string]: L3Definition }) {
  for (const item of origin.statementList) {
    if (item instanceof L2Operation) {
      method.statements.push(processOperation(item, symbols));
    } else {
      throw new Error(`Unknown statement ${item.toString()}`);
    }
  }
}

function processOperation(src: L2Operation, symbols: { [name: string]: L3Definition }) {
  const operand = processObject(src.operand, symbols);
  const steps: L3OperationStep[] = [];
  return new L3Operation(operand, steps);
}

function processObject(object: L2Base, symbols: { [name: string]: L3Definition }): L3Base {
  if (object instanceof L2Identifier) {
    if (!symbols[object.value]) {
      throw new Error(`Undefined symbol "${object.value}"`);
    }
    return new L3Identifier(object.value);
  }
  throw new Error(`Unknown object ${object.toString()}`);
}
