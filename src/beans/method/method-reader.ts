import { ERROR, fallbackPos, INVALID, Invalid } from '@/base';
import { ArgumentVariable } from '@/beans/method/argument-variable';
import { CallableTypeReader } from '@/beans/method/callable-type-reader';
import { CapyMethod } from '@/beans/method/capy-method';
import { MethodStack } from '@/beans/method/method-stack';
import { NativeMethod } from '@/beans/method/native-method';
import { UnresolvedMethod } from '@/beans/method/unresolved-method';
import { Parser } from '@/beans/parser/parser';
import { ParserContext } from '@/beans/parser/parser-context';
import { Symbol } from '@/beans/parser/symbol';
import { ToplevelReader } from '@/beans/parser/toplevel-reader';
import { StatementReader } from '@/beans/statement/statement-reader';
import { Bracket } from '@/beans/tokenizer/bracket';
import { Identifier } from '@/beans/tokenizer/identifier';
import { Keyword } from '@/beans/tokenizer/keyword';
import { Separator } from '@/beans/tokenizer/separator';
import { Token } from '@/beans/tokenizer/token';
import { Bean } from '@/util/beans';

export class MethodReader extends Bean implements ToplevelReader {
  constructor(
    private statementReader: StatementReader,
    private callableTypeReader: CallableTypeReader,
    private parser: Parser
  ) {
    super();
  }

  read(c: ParserContext): Symbol | Invalid | undefined {
    const t1 = c.current;
    const isNative = Keyword.matches(t1, 'native');
    const isFunction = Keyword.matches(t1, 'function');
    if (!isNative && !isFunction) {
      return;
    }
    c.consume();

    if (isNative) {
      const t2 = c.current;
      if (!Keyword.matches(t2, 'function')) {
        c.addError({
          level: ERROR,
          message: `Expected "function"`,
          pos: fallbackPos(t2?.pos, t1.pos),
        });
        return INVALID;
      }
      c.consume();
    }

    const t2 = c.current;
    if (!Identifier.matches(t2)) {
      c.addError({
        level: ERROR,
        message: `Expected string`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    c.consume();

    const t3 = c.current;
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

    const t4 = c.current;
    let tokenList: Token[] | undefined;
    if (isNative) {
      if (!Separator.matches(t4, ';')) {
        c.addError({
          level: ERROR,
          message: `Expected ";" but found ${t4}`,
          pos: fallbackPos(t4?.pos, type.pos),
        });
        return INVALID;
      }
    } else {
      if (!Bracket.matches(t4, '{')) {
        c.addError({
          level: ERROR,
          message: `Expected "{" but found ${t4}`,
          pos: fallbackPos(t4?.pos, type.pos),
        });
        return INVALID;
      }
      tokenList = t4.tokenList;
    }
    c.consume();

    if (isNative) {
      return new NativeMethod(c.moduleName, t2.name, type, t2.pos);
    }

    c.addTask(() => {
      const c1 = c.derive(tokenList!);
      const stack = new MethodStack();

      for (let i = 0; i < type.argList.length; i++) {
        const arg = type.argList[i];
        stack.add(new ArgumentVariable(i, arg.name, arg.type, arg.pos));
      }
      const statementList = this.statementReader.readList(c1, stack, type.returnType);

      this.parser.replaceSymbol(c, new CapyMethod(c.moduleName, t2.name, type, stack.items, statementList, t2.pos));
    });

    return new UnresolvedMethod(c.moduleName, t2.name, type, t2.pos);
  }
}
