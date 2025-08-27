import { ERROR, INVALID, Invalid } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { ExpressionContext, ExpressionReader, ReadExpressionOpts } from '@/beans/expression/expression-reader';
import { NumberLiteral } from '@/beans/expression/number-literal';
import { Reference } from '@/beans/expression/reference';
import { ReferenceProcessor } from '@/beans/expression/reference-processor';
import { StringLiteral } from '@/beans/expression/string-literal';
import { ParserContext } from '@/beans/parser/parser-context';
import { Bracket } from '@/beans/tokenizer/bracket';
import { Identifier } from '@/beans/tokenizer/identifier';
import { Number } from '@/beans/tokenizer/number';
import { Token } from '@/beans/tokenizer/token';
import { Bean } from '@/util/beans';
import { Separator } from '../tokenizer/separator';
import { String } from '../tokenizer/string';
import { OperationProcessor } from './operation-processor';

export class ExpressionReaderImpl extends Bean implements ExpressionReader {
  operationProcessors: OperationProcessor[][] = [];

  constructor(private referenceProcessors: ReferenceProcessor[], operationProcessors: OperationProcessor[]) {
    super();
    for (const item of operationProcessors) {
      while (this.operationProcessors.length <= item.pass) {
        this.operationProcessors.push([]);
      }
      this.operationProcessors[item.pass].push(item);
    }
  }

  isExpressionEnd(t: Token | undefined) {
    return !t || Separator.matches(t);
  }

  isOperand(token: Token | Expression | undefined): token is Token | Expression {
    return (
      token instanceof Expression ||
      token instanceof Identifier ||
      token instanceof Number ||
      token instanceof String ||
      (token instanceof Bracket && token.start === '(')
    );
  }

  unwrapOperand(
    c: ParserContext,
    operand: Token | Expression,
    context: ExpressionContext | null
  ): Expression | Invalid {
    if (operand instanceof Expression) {
      return operand;
    }
    if (operand instanceof Identifier) {
      return this.processReference(c, operand, context);
    }
    if (operand instanceof Number) {
      return new NumberLiteral(operand.value, operand.pos);
    }
    if (operand instanceof String) {
      return new StringLiteral(operand.value, operand.pos);
    }
    if (operand instanceof Bracket && operand.start === '(') {
      const c1 = c.derive(operand.tokenList);
      const r = this.readList(c1, context, {
        unexpectedTokenErrorMsg: (t) => `Expected ")" but found ${t}`,
      });
      if (r.length === 0) {
        c.addError({
          level: ERROR,
          message: `Expected expression`,
          pos: operand.pos,
        });
        return INVALID;
      }
      if (r.length > 1) {
        c.addError({
          level: ERROR,
          message: `Expected ")"`,
          pos: r[1].pos,
        });
        return INVALID;
      }
      return r[0];
    }
    c.addError({
      level: ERROR,
      message: `Expected expression but found ${operand}`,
      pos: operand.pos,
    });
    return INVALID;
  }

  processOperationsLTR(
    c: ParserContext,
    processors: OperationProcessor[] | undefined,
    list: (Token | Expression)[],
    context: ExpressionContext | null
  ): (Token | Expression)[] | Invalid {
    if (!processors) {
      return list;
    }

    const result: (Token | Expression)[] = [];

    let t1: Token | Expression = list[0];
    let i = 1;
    loop: while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      for (const processor of processors) {
        const r = processor.process(c, context, t1, t2, t3);
        if (!r) {
          continue;
        }
        if (r === INVALID) {
          return INVALID;
        }
        t1 = r.result;
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
    c: ParserContext,
    processors: OperationProcessor[] | undefined,
    list: (Token | Expression)[],
    context: ExpressionContext | null
  ): (Token | Expression)[] | Invalid {
    if (!processors) {
      return list;
    }

    list = [...list].reverse();

    const result: (Token | Expression)[] = [];

    let t1: Token | Expression = list[0];
    let i = 1;
    loop: while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      for (const processor of processors) {
        const r = processor.process(c, context, t1, t2, t3);
        if (!r) {
          continue;
        }
        if (r === INVALID) {
          return INVALID;
        }
        t1 = r.result;
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

  read(
    c: ParserContext,
    context: ExpressionContext | null,
    { unexpectedTokenErrorMsg }: ReadExpressionOpts = {}
  ): Expression | Invalid | undefined {
    const list: (Token | Expression)[] = [];

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

    const p1 = this.processOperationsLTR(c, this.operationProcessors[0], list, context);
    if (p1 === INVALID) {
      return INVALID;
    }
    const p2 = this.processOperationsRTL(c, this.operationProcessors[1], p1, context);
    if (p2 === INVALID) {
      return INVALID;
    }
    const p3 = this.processOperationsLTR(c, this.operationProcessors[2], p2, context);
    if (p3 === INVALID) {
      return INVALID;
    }
    const p4 = this.processOperationsLTR(c, this.operationProcessors[3], p3, context);
    if (p4 === INVALID) {
      return INVALID;
    }
    const p5 = this.processOperationsRTL(c, this.operationProcessors[4], p4, context);
    if (p5 === INVALID) {
      return INVALID;
    }

    if (p5.length > 1) {
      c.addError({
        level: ERROR,
        message: unexpectedTokenErrorMsg?.(p5[1]) ?? `Unexpected ${p5[1]}`,
        pos: p5[1].pos,
      });
      return INVALID;
    }

    return this.unwrapOperand(c, p5[0], context);
  }

  readList(c: ParserContext, context: ExpressionContext | null, opts?: ReadExpressionOpts): Expression[] {
    const outList: Expression[] = [];
    let error = false;
    while (c.current) {
      const val = this.read(c, context, opts);
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = c.current!;
          c.addError({
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
      if (!Separator.matches(t1, ',')) {
        c.addError({
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
        c.addError({
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

  processReference(c: ParserContext, ref: Identifier, context: ExpressionContext | null): Reference | Invalid {
    for (const p of this.referenceProcessors) {
      const result = p.processReference(c, ref, context);
      if (result) {
        return result;
      }
    }
    c.addError({
      level: ERROR,
      message: `Could not find reference ${ref.name}`,
      pos: ref.pos,
    });
    return INVALID;
  }

  readReference(c: ParserContext, obj: Expression | Invalid): Expression | Invalid {
    if (obj === INVALID || !obj.isReference) {
      return obj;
    }
    for (const p of this.referenceProcessors) {
      const result = p.readReference(c, obj);
      if (result) {
        return result;
      }
    }
    c.addError({
      level: ERROR,
      message: `Cannot read reference type ${obj.constructor.name}`,
      pos: obj.pos,
    });
    return INVALID;
  }
}
