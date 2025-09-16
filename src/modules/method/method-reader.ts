import { fallbackPos, INVALID } from '@/base';
import { ArgumentVariable } from '@/modules/method/argument-variable';
import { CallableTypeReader } from '@/modules/method/callable-type-reader';
import { CapyMethod } from '@/modules/method/capy-method';
import { MethodData, methodData } from '@/modules/method/method-data';
import { NativeMethod } from '@/modules/method/native-method';
import { UnresolvedMethod } from '@/modules/method/unresolved-method';
import { Parser } from '@/modules/parser/parser';
import { TokenReader } from '@/modules/parser/token-reader';
import { ToplevelReader, ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { StatementReader } from '@/modules/statement/statement-reader';
import { Bracket } from '@/modules/tokenizer/bracket';
import { Identifier } from '@/modules/tokenizer/identifier';
import { Keyword } from '@/modules/tokenizer/keyword';
import { Separator } from '@/modules/tokenizer/separator';
import { Token } from '@/modules/tokenizer/token';
import { Bean } from '@/util/beans';

export class MethodReader extends Bean implements ToplevelReader {
  constructor(
    private statementReader: StatementReader,
    private callableTypeReader: CallableTypeReader,
    private parser: Parser
  ) {
    super();
  }

  async read(c: ToplevelReaderContext) {
    const t1 = c.tokenReader.current;
    const isNative = Keyword.matches(t1, 'native');
    const isFunction = Keyword.matches(t1, 'function');
    if (!isNative && !isFunction) {
      return;
    }
    c.tokenReader.consume();

    if (isNative) {
      const t2 = c.tokenReader.current;
      if (!Keyword.matches(t2, 'function')) {
        c.parseErrors.addError(`Expected "function"`, fallbackPos(t2?.pos, t1.pos));
        return INVALID;
      }
      c.tokenReader.consume();
    }

    const t2 = c.tokenReader.current;
    if (!Identifier.matches(t2)) {
      c.parseErrors.addError(`Expected string`, fallbackPos(t2?.pos, t1.pos));
      return INVALID;
    }
    c.tokenReader.consume();

    const t3 = c.tokenReader.current;
    const type = t3 && this.callableTypeReader.read(c);
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      c.parseErrors.addError(`Expected type`, fallbackPos(t3?.pos, t2.pos));
      return INVALID;
    }

    const t4 = c.tokenReader.current;
    let tokenList: Token[] | undefined;
    if (isNative) {
      if (!Separator.matches(t4, ';')) {
        c.parseErrors.addError(`Expected ";" but found ${t4}`, fallbackPos(t4?.pos, type.pos));
        return INVALID;
      }
    } else {
      if (!Bracket.matches(t4, '{')) {
        c.parseErrors.addError(`Expected "{" but found ${t4}`, fallbackPos(t4?.pos, type.pos));
        return INVALID;
      }
      tokenList = t4.tokenList;
    }
    c.tokenReader.consume();

    if (isNative) {
      return new NativeMethod(c.currentModule, t2.name, type, t2.pos);
    }

    c.parserData.addTask(() => {
      const _methodData = new MethodData(null, type.returnType);
      for (let i = 0; i < type.argList.length; i++) {
        const arg = type.argList[i];
        _methodData.add(new ArgumentVariable(i, arg.name, arg.type, arg.pos));
      }

      const c1 = {
        ...c,
        ...methodData.wrap(_methodData),
        tokenReader: new TokenReader(tokenList!),
      };
      const statementList = this.statementReader.readList(c1);

      c.parserData.replaceSymbol(
        new CapyMethod(c.currentModule, t2.name, type, _methodData.items, statementList, t2.pos)
      );
    });

    return new UnresolvedMethod(c.currentModule, t2.name, type, t2.pos);
  }
}
