import { fallbackPos, INVALID, Invalid } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { ExpressionReader } from '@/modules/expression/expression-reader';
import { LocalVariable } from '@/modules/method/local-variable';
import { LocalVariableReference } from '@/modules/method/local-variable-reference';
import { methodData } from '@/modules/method/method-data';
import { Assignment } from '@/modules/operation/assignment';
import { ExpressionStatement } from '@/modules/statement/expression-statement';
import { Statement } from '@/modules/statement/statement';
import { StatementItemReader } from '@/modules/statement/statement-item-reader';
import { StatementReaderContext } from '@/modules/statement/statement-reader';
import { Identifier } from '@/modules/tokenizer/identifier';
import { Keyword } from '@/modules/tokenizer/keyword';
import { Operator } from '@/modules/tokenizer/operator';
import { Separator } from '@/modules/tokenizer/separator';
import { TypeReader } from '@/modules/type/type-reader';
import { Bean } from '@/util/beans';

export class LocalVariableStatementReader extends Bean implements StatementItemReader {
  constructor(private expressionReader: ExpressionReader, private typeReader: TypeReader) {
    super();
  }

  read(c: StatementReaderContext): Statement | Invalid | undefined {
    const md = methodData.optionalFrom(c);
    if (!md) {
      return;
    }
    const t1 = c.tokenReader.current;
    if (!Keyword.matches(t1, 'var')) {
      return;
    }
    c.tokenReader.consume();

    const t2 = c.tokenReader.current;
    if (!Identifier.matches(t2)) {
      c.parseErrors.addError(`Expected identifier`, fallbackPos(t2?.pos, t1.pos));
      return INVALID;
    }
    c.tokenReader.consume();

    let t3 = c.tokenReader.current;
    if (!Operator.matches(t3, ':')) {
      c.parseErrors.addError(`Expected ":"`, fallbackPos(t3?.pos, t2.pos));
      return INVALID;
    }
    c.tokenReader.consume();

    const t4 = c.tokenReader.current;
    const type = t4 && this.typeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.parseErrors.addError(`Expected type`, fallbackPos(t4?.pos, t3.pos));
      return INVALID;
    }

    t3 = c.tokenReader.current;
    let initExpr: Expression | null = null;
    if (Operator.matches(t3, '=')) {
      c.tokenReader.consume();

      const t4 = c.tokenReader.current;
      const _initExpr = t4 && this.expressionReader.read(c);
      if (_initExpr === INVALID) {
        return INVALID;
      }
      if (!_initExpr) {
        c.parseErrors.addError(`Expected initializer`, fallbackPos(t4?.pos, t3.pos));
        return INVALID;
      }
      initExpr = _initExpr;
    }

    const t5 = c.tokenReader.current;
    if (Separator.matches(t5, ';')) {
      c.tokenReader.consume();
    } else {
      c.parseErrors.addError(type === initExpr ? `Expected ";"` : `Expected "=" or ";"`, fallbackPos(t5?.pos, t3!.pos));
    }
    if (initExpr && !this.typeReader.isAssignable(initExpr.type, type)) {
      c.parseErrors.addError(`Variable has type "${type}" but initializer has type "${initExpr.type}"`, t2.pos);
    }
    const localVariable = new LocalVariable(t2.name, type, t2.pos);
    const index = md.add(localVariable);
    if (index === false) {
      c.parseErrors.addError(`Identifier "${t2.name}" already declared`, t2.pos);
      return INVALID;
    }
    if (initExpr) {
      return new ExpressionStatement(
        new Assignment(initExpr, new LocalVariableReference(index, t2.name, type, t2.pos), type, t2.pos),
        t2.pos
      );
    }
  }
}
