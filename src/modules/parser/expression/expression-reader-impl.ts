import { INVALID, Invalid } from '@/base';
import { Dereference } from '@/modules/parser/expression/dereference';
import { Expression } from '@/modules/parser/expression/expression';
import {
  ExpressionReader,
  ExpressionReaderContext,
  ReadExpressionOpts,
} from '@/modules/parser/expression/expression-reader';
import { IdentifierResolver } from '@/modules/parser/expression/identifier-resolver';
import { NumberLiteral } from '@/modules/parser/expression/number-literal';
import { StringLiteral } from '@/modules/parser/expression/string-literal';
import { tokenReader } from '@/modules/parser/parser/token-reader';
import { Bracket } from '@/modules/parser/tokenizer/bracket';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { Number } from '@/modules/parser/tokenizer/number';
import { Token } from '@/modules/parser/tokenizer/token';
import { Bean } from '@/util/beans';
import { Separator } from '../tokenizer/separator';
import { String } from '../tokenizer/string';
import { OperationProcessor } from './operation-processor';

export class ExpressionReaderImpl extends Bean implements ExpressionReader {
  operationProcessors: OperationProcessor[][] = [];

  constructor(private identifierResolvers: IdentifierResolver[], operationProcessors: OperationProcessor[]) {
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

  isOperand(obj: Token | Expression | undefined): obj is Token | Expression {
    return (
      obj instanceof Expression ||
      obj instanceof Identifier ||
      obj instanceof Number ||
      obj instanceof String ||
      (obj instanceof Bracket && obj.start === '(')
    );
  }

  private internalResolveOperand(c: ExpressionReaderContext, obj: Token | Expression) {
    if (obj instanceof Expression) {
      return obj;
    }
    if (obj instanceof Identifier) {
      return this.resolveIdentifier(c, obj);
    }
    if (obj instanceof Number) {
      return new NumberLiteral(obj.value, obj.pos);
    }
    if (obj instanceof String) {
      return new StringLiteral(obj.value, obj.pos);
    }
    if (obj instanceof Bracket && obj.start === '(') {
      const r = this.readList(c.with(tokenReader(obj.tokenList)), {
        unexpectedTokenErrorMsg: (t) => `Expected ")" but found ${t}`,
      });
      if (r.length === 0) {
        c.parseErrors.addError(`Expected expression`, obj.pos);
        return INVALID;
      }
      if (r.length > 1) {
        c.parseErrors.addError(`Expected ")"`, r[1].pos);
        return INVALID;
      }
      return r[0];
    }
    c.parseErrors.addError(`Expected operand but found ${obj}`, obj.pos);
    return INVALID;
  }

  resolveOperand(c: ExpressionReaderContext, obj: Token | Expression, dereference: boolean): Expression | Invalid {
    const operand = this.internalResolveOperand(c, obj);
    if (operand === INVALID) {
      return INVALID;
    }
    if (dereference && operand.isReference) {
      return new Dereference(operand, operand.type, operand.pos);
    }
    return operand;
  }

  processOperationsLTR(
    c: ExpressionReaderContext,
    processors: OperationProcessor[] | undefined,
    list: (Token | Expression)[]
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
        const r = processor.process(c, t1, t2, t3);
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
    c: ExpressionReaderContext,
    processors: OperationProcessor[] | undefined,
    list: (Token | Expression)[]
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
        const r = processor.process(c, t1, t2, t3);
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
    c: ExpressionReaderContext,
    { unexpectedTokenErrorMsg }: ReadExpressionOpts = {}
  ): Expression | Invalid | undefined {
    const list: (Token | Expression)[] = [];

    while (true) {
      const t = c.tokenReader.current;
      if (this.isExpressionEnd(t)) {
        break;
      }
      list.push(t!);
      c.tokenReader.consume();
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
      c.parseErrors.addError(unexpectedTokenErrorMsg?.(p5[1]) ?? `Unexpected ${p5[1]}`, p5[1].pos);
      return INVALID;
    }

    return this.resolveOperand(c, p5[0], true);
  }

  readList(c: ExpressionReaderContext, opts?: ReadExpressionOpts): Expression[] {
    const outList: Expression[] = [];
    let error = false;
    while (c.tokenReader.current) {
      const val = this.read(c, opts);
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = c.tokenReader.current!;
          c.parseErrors.addError(`Unexpected ${t}`, {
            lin1: t.pos.lin1,
            col1: t.pos.col1,
            lin2: t.pos.lin2,
            col2: t.pos.col2,
          });
        }
        c.tokenReader.consume();
        continue;
      }

      outList.push(val);
      error = false;

      const t1 = c.tokenReader.current;
      if (!t1) {
        break;
      }
      if (!Separator.matches(t1, ',')) {
        c.parseErrors.addError(`Expected ","`, {
          lin1: t1.pos.lin1,
          col1: t1.pos.col1,
          lin2: t1.pos.lin2,
          col2: t1.pos.col2,
        });
        c.tokenReader.consume();
        continue;
      }
      c.tokenReader.consume();

      const t2 = c.tokenReader.current;
      if (!t2) {
        c.parseErrors.addError(`Expected expression after ","`, {
          lin1: t1.pos.lin2,
          col1: t1.pos.col2,
          lin2: t1.pos.lin2,
          col2: t1.pos.col2,
        });
      }
    }
    return outList;
  }

  resolveIdentifier(c: ExpressionReaderContext, obj: Identifier): Expression | Invalid {
    for (const p of this.identifierResolvers) {
      const result = p.resolveIdentifier(c, obj);
      if (result) {
        return result;
      }
    }
    c.parseErrors.addError(`Could not resolve identifier "${obj.name}"`, obj.pos);
    return INVALID;
  }
}
