import { ERROR } from '@/base';
import { L1Base } from '@/beans/l1-parser/l1-base';
import { Bean } from '@/util/beans';
import { L1Bracket } from '../l1-parser/l1-bracket';
import { L1Identifier } from '../l1-parser/l1-identifier';
import { L1Number } from '../l1-parser/l1-number';
import { L1Separator } from '../l1-parser/l1-separator';
import { L1String } from '../l1-parser/l1-string';
import { Invalid, INVALID, L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L2Expression, L2Identifier, L2Number, L2Operation, L2OperationStep, L2String } from './l2-expression';
import { L2ExpressionReader, ReadExpressionOpts } from './l2-expression-reader';
import { L2OperationProcessor } from './l2-operation-processor';

export class L2ExpressionReaderImpl extends Bean implements L2ExpressionReader {
  operationProcessors: L2OperationProcessor[][] = [];

  constructor(operationProcessors: L2OperationProcessor[]) {
    super();
    for (const item of operationProcessors) {
      while (this.operationProcessors.length <= item.pass) {
        this.operationProcessors.push([]);
      }
      this.operationProcessors[item.pass].push(item);
    }
  }

  isExpressionEnd(t: L1Base | undefined) {
    return !t || L1Separator.matches(t);
  }

  isOperand(token: L1Base | L2Expression | undefined): token is L1Base | L2Expression {
    return (
      token instanceof L2Expression ||
      token instanceof L1Identifier ||
      token instanceof L1Number ||
      token instanceof L1String ||
      (token instanceof L1Bracket && token.start === '(')
    );
  }

  unwrapOperand(c: L2ParseContext, operand: L1Base | L2Expression): L2Expression | Invalid {
    if (operand instanceof L2Expression) {
      return operand;
    }
    if (operand instanceof L1Identifier) {
      return new L2Identifier(operand.name, operand.pos);
    }
    if (operand instanceof L1Number) {
      return new L2Number(operand.value, operand.pos);
    }
    if (operand instanceof L1String) {
      return new L2String(operand.value, operand.pos);
    }
    if (operand instanceof L1Bracket && operand.start === '(') {
      const c1 = new L2ParseContext(operand.tokenList);
      const r = this.readList(c1, {
        unexpectedTokenErrorMsg: (t) => `Expected ")" but found ${t}`,
      });
      c.errors.push(...c1.errors);
      if (r.length === 0) {
        c.errors.push({
          level: ERROR,
          message: `Expected expression`,
          pos: operand.pos,
        });
        return INVALID;
      }
      if (r.length > 1) {
        c.errors.push({
          level: ERROR,
          message: `Expected ")"`,
          pos: r[1].pos,
        });
        return INVALID;
      }
      return r[0];
    }
    c.errors.push({
      level: ERROR,
      message: `Expected expression but found ${operand}`,
      pos: operand.pos,
    });
    return INVALID;
  }

  createOperation(c: L2ParseContext, t1: L1Base | L2Expression, step: L2OperationStep): L2Operation | Invalid {
    if (t1 instanceof L2Operation) {
      t1.steps.push(step);
      t1.pos = step.pos;
      return t1;
    }
    const operand = this.unwrapOperand(c, t1);
    if (operand === INVALID) {
      return INVALID;
    }
    return new L2Operation(operand, [step], step.pos);
  }

  processOperationsLTR(
    c: L2ParseContext,
    processors: L2OperationProcessor[] | undefined,
    list: (L1Base | L2Expression)[]
  ): (L1Base | L2Expression)[] | Invalid {
    if (!processors) {
      return list;
    }

    const result: (L1Base | L2Expression)[] = [];

    let t1: L1Base | L2Expression = list[0];
    let i = 1;
    loop: while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      for (const processor of processors) {
        const r = processor.process(c, t1, t2, t3);
        if (!r) {
          continue;
        }
        if (r === INVALID) {
          return INVALID;
        }
        const operation = this.createOperation(c, t1, r.step);
        if (operation === INVALID) {
          return INVALID;
        }
        t1 = operation;
        i += r.skip;
        continue loop;
      }

      result.push(t1);
      t1 = t2;
      i++;
    }
    result.push(t1);
    return result;
  }

  processOperationsRTL(
    c: L2ParseContext,
    processors: L2OperationProcessor[] | undefined,
    list: (L1Base | L2Expression)[]
  ): (L1Base | L2Expression)[] | Invalid {
    if (!processors) {
      return list;
    }

    list = [...list].reverse();

    const result: (L1Base | L2Expression)[] = [];

    let t1: L1Base | L2Expression = list[0];
    let i = 1;
    loop: while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      for (const processor of processors) {
        const r = processor.process(c, t1, t2, t3);
        if (!r) {
          continue;
        }
        if (r === INVALID) {
          return INVALID;
        }
        const operation = this.createOperation(c, t1, r.step);
        if (operation === INVALID) {
          return INVALID;
        }
        t1 = operation;
        i += r.skip;
        continue loop;
      }

      result.push(t1);
      t1 = t2;
      i++;
    }
    result.push(t1);
    result.reverse();
    return result;
  }

  read(c: L2ParseContext, { unexpectedTokenErrorMsg }: ReadExpressionOpts = {}): ReadResult<L2Expression> {
    const list: (L1Base | L2Expression)[] = [];

    while (true) {
      const t = c.current;
      if (this.isExpressionEnd(t)) {
        break;
      }
      list.push(t!);
      c.consume();
    }

    if (list.length === 0) {
      return;
    }

    const p1 = this.processOperationsLTR(c, this.operationProcessors[0], list);
    if (p1 === INVALID) {
      return INVALID;
    }
    const p2 = this.processOperationsRTL(c, this.operationProcessors[1], p1);
    if (p2 === INVALID) {
      return INVALID;
    }
    const p3 = this.processOperationsLTR(c, this.operationProcessors[2], p2);
    if (p3 === INVALID) {
      return INVALID;
    }
    const p4 = this.processOperationsLTR(c, this.operationProcessors[3], p3);
    if (p4 === INVALID) {
      return INVALID;
    }
    const p5 = this.processOperationsRTL(c, this.operationProcessors[4], p4);
    if (p5 === INVALID) {
      return INVALID;
    }

    if (p5.length > 1) {
      c.errors.push({
        level: ERROR,
        message: unexpectedTokenErrorMsg?.(p5[1]) ?? `Unexpected ${p5[1]}`,
        pos: p5[1].pos,
      });
      return INVALID;
    }

    return this.unwrapOperand(c, p5[0]);
  }

  readList(c: L2ParseContext, opts: ReadExpressionOpts = {}): L2Expression[] {
    const outList: L2Expression[] = [];
    let error = false;
    while (c.current) {
      const val = this.read(c, opts);
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = c.current!;
          c.errors.push({
            level: ERROR,
            message: `Unexpected ${t}`,
            pos: {
              lin1: t.pos.lin1,
              col1: t.pos.col1,
              lin2: t.pos.lin2,
              col2: t.pos.col2,
            },
          });
        }
        c.consume();
        continue;
      }

      outList.push(val);
      error = false;

      const t1 = c.current;
      if (!t1) {
        break;
      }
      if (!L1Separator.matches(t1, ',')) {
        c.errors.push({
          level: ERROR,
          message: `Expected ","`,
          pos: {
            lin1: t1.pos.lin1,
            col1: t1.pos.col1,
            lin2: t1.pos.lin2,
            col2: t1.pos.col2,
          },
        });
        c.consume();
        continue;
      }
      c.consume();

      const t2 = c.current;
      if (!t2) {
        c.errors.push({
          level: ERROR,
          message: `Expected expression after ","`,
          pos: {
            lin1: t1.pos.lin2,
            col1: t1.pos.col2,
            lin2: t1.pos.lin2,
            col2: t1.pos.col2,
          },
        });
      }
    }
    return outList;
  }
}
