import { ERROR, fallbackPos, INVALID, Invalid } from '@/base';
import { ArgumentVariable } from '@/modules/parser/method/argument-variable';
import { CallableTypeReader } from '@/modules/parser/method/callable-type-reader';
import { CapyMethod } from '@/modules/parser/method/capy-method';
import { methodExtraKey } from '@/modules/parser/method/method-extra';
import { MethodStack } from '@/modules/parser/method/method-stack';
import { NativeMethod } from '@/modules/parser/method/native-method';
import { UnresolvedMethod } from '@/modules/parser/method/unresolved-method';
import { Parser } from '@/modules/parser/parser/parser';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Symbol } from '@/modules/parser/parser/symbol';
import { ToplevelReader } from '@/modules/parser/parser/toplevel-reader';
import { StatementReader } from '@/modules/parser/statement/statement-reader';
import { Bracket } from '@/modules/parser/tokenizer/bracket';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { Keyword } from '@/modules/parser/tokenizer/keyword';
import { Separator } from '@/modules/parser/tokenizer/separator';
import { Token } from '@/modules/parser/tokenizer/token';
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
      const callback = c.moduleInput.extra.get(methodExtraKey)?.nativeMethods[t2.name];
      if (!callback) {
        c.addError({
          level: ERROR,
          message: `Declared native function "${t2.name}" but native implementation was not found`,
          pos: fallbackPos(t4?.pos, type.pos),
        });
        return INVALID;
      }
      return new NativeMethod(c.moduleName, t2.name, type, callback, t2.pos);
    }

    c.addTask(() => {
      const c1 = c.derive(tokenList!);
      const stack = new MethodStack(null, type.returnType);

      for (let i = 0; i < type.argList.length; i++) {
        const arg = type.argList[i];
        stack.add(new ArgumentVariable(i, arg.name, arg.type, arg.pos));
      }
      const statementList = this.statementReader.readList(c1, stack);

      this.parser.replaceSymbol(c, new CapyMethod(c.moduleName, t2.name, type, stack.items, statementList, t2.pos));
    });

    return new UnresolvedMethod(c.moduleName, t2.name, type, t2.pos);
  }
}
