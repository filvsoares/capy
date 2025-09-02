import { combinePos, fallbackPos, Invalid, INVALID } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { ExpressionReader } from '@/modules/parser/expression/expression-reader';
import { GlobalVariable } from '@/modules/parser/global-variable/global-variable';
import { Symbol } from '@/modules/parser/parser/symbol';
import { ToplevelReader, ToplevelReaderContext } from '@/modules/parser/parser/toplevel-reader';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { Keyword } from '@/modules/parser/tokenizer/keyword';
import { Operator } from '@/modules/parser/tokenizer/operator';
import { Separator } from '@/modules/parser/tokenizer/separator';
import { TypeReader } from '@/modules/parser/type/type-reader';
import { Bean } from '@/util/beans';

export class GlobalVariableReader extends Bean implements ToplevelReader {
  constructor(private typeReader: TypeReader, private expressionReader: ExpressionReader) {
    super();
  }

  read(c: ToplevelReaderContext): Symbol | Invalid | undefined {
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

    return new GlobalVariable(c.currentModule, t2.name, type, initExpr, combinePos(t1.pos, (t5 ?? t2).pos));
  }
}
