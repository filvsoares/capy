import { ERROR, fallbackPos, INVALID, Invalid } from '@/base';
import { ArgumentVariable } from '@/beans/method/argument-variable';
import { CallableTypeReader } from '@/beans/method/callable-type-reader';
import { CapyMethod } from '@/beans/method/capy-method';
import { MethodStack } from '@/beans/method/method-stack';
import { Bracket } from '@/beans/parser/bracket';
import { Identifier } from '@/beans/parser/identifier';
import { Keyword } from '@/beans/parser/keyword';
import { ParserContext, ToplevelParserContext } from '@/beans/parser/parser';
import { ToplevelReader } from '@/beans/parser/toplevel-reader';
import { StatementReader } from '@/beans/statement/statement-reader';
import { Bean } from '@/util/beans';

export class MethodReader extends Bean implements ToplevelReader {
  constructor(private statementReader: StatementReader, private callableTypeReader: CallableTypeReader) {
    super();
  }

  read(c: ToplevelParserContext): true | Invalid | undefined {
    const t1 = c.current();
    if (!Keyword.matches(t1, 'function')) {
      return;
    }
    c.consume();

    const t2 = c.current();
    if (!Identifier.matches(t2)) {
      c.addError({
        level: ERROR,
        message: `Expected string`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    c.consume();

    const t3 = c.current();
    const type = t3 && this.callableTypeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.addError({
        level: ERROR,
        message: `Expected type`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
      return INVALID;
    }

    const t4 = c.current();
    if (!Bracket.matches(t4, '{')) {
      c.addError({
        level: ERROR,
        message: `Expected "{" but found ${t4}`,
        pos: fallbackPos(t4?.pos, type.pos),
      });
      return INVALID;
    }
    c.consume();

    const tokenList = t4.tokenList;
    let currentToken = tokenList[0];
    let pos = 0;

    const c1: ParserContext = {
      addError: (e) => {
        c.addError(e);
      },
      current: () => currentToken,
      consume: () => {
        currentToken = tokenList[++pos];
      },
      findSymbols: () => undefined,
    };

    const stack = new MethodStack();

    for (let i = 0; i < type.argList.length; i++) {
      const arg = type.argList[i];
      stack.add(new ArgumentVariable(i, arg.name, arg.type, arg.pos));
    }
    const statementList = this.statementReader.readList(c1, stack, type.returnType);

    const dst = new CapyMethod(t2.name, type, stack.items, statementList, t2.pos);
    if (!c.addToMySymbols(dst)) {
      c.addError({
        level: ERROR,
        message: `Symbol "${dst.name}" already defined`,
        pos: t2.pos,
      });
    }
    return true;
  }
}
