import { ERROR, fallbackPos, INVALID, Invalid } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { ExpressionReader } from '@/modules/parser/expression/expression-reader';
import { LocalVariable } from '@/modules/parser/method/local-variable';
import { LocalVariableReference } from '@/modules/parser/method/local-variable-reference';
import { MethodContext } from '@/modules/parser/method/method-context';
import { Assignment } from '@/modules/parser/operation/assignment';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { ExpressionStatement } from '@/modules/parser/statement/expression-statement';
import { Statement } from '@/modules/parser/statement/statement';
import { StatementContext } from '@/modules/parser/statement/statement-context';
import { StatementItemReader } from '@/modules/parser/statement/statement-item-reader';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { Keyword } from '@/modules/parser/tokenizer/keyword';
import { Operator } from '@/modules/parser/tokenizer/operator';
import { Separator } from '@/modules/parser/tokenizer/separator';
import { TypeReader } from '@/modules/parser/type/type-reader';
import { Bean } from '@/util/beans';

export class LocalVariableStatementReader extends Bean implements StatementItemReader {
  constructor(private expressionReader: ExpressionReader, private typeReader: TypeReader) {
    super();
  }

  read(c: ParserContext, context: StatementContext): Statement | Invalid | undefined {
    if (!(context instanceof MethodContext)) {
      return;
    }
    const t1 = c.current;
    if (!Keyword.matches(t1, 'var')) {
      return;
    }
    c.consume();

    const t2 = c.current;
    if (!Identifier.matches(t2)) {
      c.addError({
        level: ERROR,
        message: `Expected identifier`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    c.consume();

    let t3 = c.current;
    if (!Operator.matches(t3, ':')) {
      c.addError({
        level: ERROR,
        message: `Expected ":"`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
      return INVALID;
    }
    c.consume();

    const t4 = c.current;
    const type = t4 && this.typeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.addError({
        level: ERROR,
        message: `Expected type`,
        pos: fallbackPos(t4?.pos, t3.pos),
      });
      return INVALID;
    }

    t3 = c.current;
    let initExpr: Expression | null = null;
    if (Operator.matches(t3, '=')) {
      c.consume();

      const t4 = c.current;
      const _initExpr = t4 && this.expressionReader.read(c, null);
      if (_initExpr === INVALID) {
        return INVALID;
      }
      if (!_initExpr) {
        c.addError({
          level: ERROR,
          message: `Expected initializer`,
          pos: fallbackPos(t4?.pos, t3.pos),
        });
        return INVALID;
      }
      initExpr = _initExpr;
    }

    const t5 = c.current;
    if (Separator.matches(t5, ';')) {
      c.consume();
    } else {
      c.addError({
        level: ERROR,
        message: type === initExpr ? `Expected ";"` : `Expected "=" or ";"`,
        pos: fallbackPos(t5?.pos, t3!.pos),
      });
    }
    if (initExpr && !this.typeReader.isAssignable(initExpr.type, type)) {
      c.addError({
        level: ERROR,
        message: `Variable has type "${type}" but initializer has type "${initExpr.type}"`,
        pos: t2.pos,
      });
    }
    const localVariable = new LocalVariable(t2.name, type, t2.pos);
    const index = context.add(localVariable);
    if (index === false) {
      c.addError({
        level: ERROR,
        message: `Identifier "${t2.name}" already declared`,
        pos: t2.pos,
      });
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
