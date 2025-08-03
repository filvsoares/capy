import {
  L3Base,
  L3Expression,
  L3ExpressionStatement,
  L3LibraryMethod,
  L3Method,
  L3MethodCall,
  L3Number,
  L3Operation,
  L3Reference,
  L3Statement,
  L3String,
  L3StringConcat,
  Runnable,
} from './l3-types';

export class Runner {
  r: Runnable;
  symbolValues: { [name: string]: any } = {};
  stdout: string = '';

  constructor(r: Runnable) {
    this.r = r;
  }

  resolveSymbol(name: string) {
    return this.r.symbols[name];
  }

  runExpression(obj: L3Expression) {
    if (obj instanceof L3String) {
      return obj.value;
    }
    if (obj instanceof L3Number) {
      return obj.value;
    }
    if (obj instanceof L3Reference) {
      return obj.name;
    }
    if (obj instanceof L3Operation) {
      return this.runOperation(obj);
    }

    throw new Error(`Cannot read value from ${obj}`);
  }

  runOperation(op: L3Operation) {
    let current: any = this.runExpression(op.operand);
    for (const step of op.steps) {
      if (step instanceof L3MethodCall) {
        const ref = this.resolveSymbol(current);
        const argList: any[] = [];
        for (const arg of step.argList) {
          argList.push(this.runExpression(arg));
        }
        if (ref instanceof L3LibraryMethod) {
          ref.callback(argList, this);
        } else if (ref instanceof L3Method) {
          this.runStatementList(ref.statements);
        } else {
          throw new Error(`Cannot run ${ref}`);
        }
      } else if (step instanceof L3StringConcat) {
        const other = this.runExpression(step.other);
        current += other;
      } else {
        throw new Error(`Unknown step ${step}`);
      }
    }
    return current;
  }

  runStatementList(list: L3Statement[]) {
    for (const item of list) {
      if (item instanceof L3ExpressionStatement) {
        this.runExpression(item.expr);
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
