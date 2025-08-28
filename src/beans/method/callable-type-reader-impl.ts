import { CallableType } from '@/beans/method/callable-type';
import { CallableTypeReader } from '@/beans/method/callable-type-reader';
import { ParserContext } from '@/beans/parser/parser-context';
import { Bracket } from '@/beans/tokenizer/bracket';
import { VOID } from '@/beans/type/simple-type';
import { Type } from '@/beans/type/type';
import { TypeItemReader } from '@/beans/type/type-item-reader';
import { TypeReader } from '@/beans/type/type-reader';
import { Bean } from '@/util/beans';
import { combinePos, ERROR, INVALID, Invalid } from '../../base';
import { Operator } from '../tokenizer/operator';
import { ArgumentReader } from './argument-reader';

export class CallableTypeReaderImpl extends Bean implements TypeItemReader, CallableTypeReader {
  constructor(private typeReader: TypeReader, private argumentReader: ArgumentReader) {
    super();
  }

  read(c: ParserContext): CallableType | Invalid | undefined {
    const t1 = c.current;
    if (!Bracket.matches(t1, '(')) {
      return;
    }
    c.consume();

    let returnType: Type = VOID;

    const c1 = c.derive(t1.tokenList);
    const args = this.argumentReader.readList(c1);

    const t2 = c.current;
    if (Operator.matches(t2, ':')) {
      c.consume();

      const _returnType = this.typeReader.read(c);
      if (_returnType === INVALID) {
        return INVALID;
      }
      if (!_returnType) {
        c.addError({
          level: ERROR,
          message: `Expected type`,
          pos: t2.pos,
        });
        return INVALID;
      }
      returnType = _returnType;
    }

    return new CallableType(args, returnType, combinePos(t1.pos, (returnType ?? t1).pos));
  }

  isAssignable(type: Type, assignTo: Type): boolean | undefined {
    if (type instanceof CallableType && assignTo instanceof CallableType) {
      if (!this.typeReader.isAssignable(type.returnType, assignTo.returnType)) {
        return false;
      }
      if (type.argList.length !== assignTo.argList.length) {
        return false;
      }
      for (let i = 0; i < type.argList.length; i++) {
        if (!this.typeReader.isAssignable(type.argList[i].type, assignTo.argList[i].type)) {
          return false;
        }
      }
      return true;
    }
  }
}
