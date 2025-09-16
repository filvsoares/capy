import { combinePos, fallbackPos, INVALID } from '@/base';
import { ExpressionReader } from '@/modules/expression/expression-reader';
import { GlobalVariable } from '@/modules/global-variable/global-variable';
import { TokenReader } from '@/modules/parser/token-reader';
import { ToplevelReader, ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { Identifier } from '@/modules/tokenizer/identifier';
import { Keyword } from '@/modules/tokenizer/keyword';
import { Operator } from '@/modules/tokenizer/operator';
import { Separator } from '@/modules/tokenizer/separator';
import { Token } from '@/modules/tokenizer/token';
import { TypeReader } from '@/modules/type/type-reader';
import { Bean } from '@/util/beans';

export class GlobalVariableReader extends Bean implements ToplevelReader {
  constructor(private typeReader: TypeReader, private expressionReader: ExpressionReader) {
    super();
  }

  async read(c: ToplevelReaderContext) {
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

    const t3 = c.tokenReader.current;
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

    const obj = new GlobalVariable(c.currentModule, t2.name, type, null, combinePos(t1.pos, t4.pos));

    let hasInitExpr = false;
    const t5 = c.tokenReader.current;
    if (Operator.matches(t5, '=')) {
      hasInitExpr = true;
      c.tokenReader.consume();

      const initExpr: Token[] = [];
      while (true) {
        const t6 = c.tokenReader.current;
        if (!t6 || Separator.matches(t6)) {
          break;
        }
        initExpr.push(t6);
        c.tokenReader.consume();
      }

      if (initExpr.length > 0) {
        c.parserData.addTask(() => {
          const _initExpr = this.expressionReader.read({ ...c, tokenReader: new TokenReader(initExpr) });
          if (!_initExpr) {
            c.parseErrors.addError(`Unexpected ${initExpr[0]}`, initExpr[0].pos);
            return;
          }
          if (_initExpr === INVALID) {
            return;
          }
          obj.initExpr = _initExpr;
        });
      } else {
        c.parseErrors.addError(`Expected expression`, c.tokenReader.current?.pos);
      }
    }

    const t7 = c.tokenReader.current;
    if (Separator.matches(t7, ';')) {
      c.tokenReader.consume();
    } else {
      c.parseErrors.addError(hasInitExpr ? `Expected ";"` : `Expected "=" or ";"`, fallbackPos(t5?.pos, t3!.pos));
    }

    return obj;
  }
}
