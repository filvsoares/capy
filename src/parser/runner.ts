import {
  L3Base,
  L3ExpressionStatement,
  L3LibraryMethod,
  L3Method,
  L3MethodCall,
  L3Number,
  L3Operation,
  L3Reference,
  L3Statement,
  L3String,
  Runnable,
} from './l3-types';

export class Runner {
  r: Runnable;
  symbolValues: { [name: string]: any } = {};
  stdout: string = '';

  constructor(r: Runnable) {
    this.r = r;
  }

  resolveReference(obj: L3Base) {
    if (!(obj instanceof L3Reference)) {
      return obj;
    }
    return this.r.symbols[obj.name];
  }

  readValue(obj: L3Base) {
    if (obj instanceof L3String) {
      return obj.value;
    }
    if (obj instanceof L3Number) {
      return obj.value;
    }
    throw new Error(`Cannot read value from ${obj}`);
  }

  runOperation(op: L3Operation) {
    let current = op.operand;
    for (const step of op.steps) {
      if (step instanceof L3MethodCall) {
        current = this.resolveReference(current);
        const argList: any[] = [];
        for (const arg of step.argList) {
          argList.push(this.readValue(arg));
        }
        if (current instanceof L3LibraryMethod) {
          current.callback(argList, this);
        } else if (current instanceof L3Method) {
          this.runStatementList(current.statements);
        } else {
          throw new Error(`Cannot run ${current}`);
        }
      } else {
        throw new Error(`Unknown step ${step}`);
      }
    }
  }

  runExpression(obj: L3ExpressionStatement) {
    if (obj.expr instanceof L3Operation) {
      this.runOperation(obj.expr);
    } else {
      throw new Error(`Cannot run ${obj.expr}`);
    }
  }

  runStatementList(list: L3Statement[]) {
    for (const item of list) {
      if (item instanceof L3ExpressionStatement) {
        this.runExpression(item);
      } else {
        throw new Error(`Unknown statement ${item}`);
      }
    }
  }

  run() {
    this.runStatementList(this.r.initialStatements);
  }

  print(s: string) {
    this.stdout += s + '\n';
  }
}
