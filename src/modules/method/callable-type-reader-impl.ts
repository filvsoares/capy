import { combinePos, INVALID, Invalid } from '@/base';
import { CallableType } from '@/modules/method/callable-type';
import { CallableTypeReader } from '@/modules/method/callable-type-reader';
import { TokenReader } from '@/modules/parser/token-reader';
import { Bracket } from '@/modules/tokenizer/bracket';
import { VOID } from '@/modules/type/simple-type';
import { Type } from '@/modules/type/type';
import { TypeItemReader } from '@/modules/type/type-item-reader';
import { TypeReader, TypeReaderContext } from '@/modules/type/type-reader';
import { Bean } from '@/util/beans';
import { Operator } from '../tokenizer/operator';
import { ArgumentReader } from './argument-reader';

export class CallableTypeReaderImpl extends Bean implements TypeItemReader, CallableTypeReader {
  constructor(private typeReader: TypeReader, private argumentReader: ArgumentReader) {
    super();
  }

  read(c: TypeReaderContext): CallableType | Invalid | undefined {
    const t1 = c.tokenReader.current;
    if (!Bracket.matches(t1, '(')) {
      return;
    }
    c.tokenReader.consume();

    let returnType: Type = VOID;

    const args = this.argumentReader.readList({ ...c, tokenReader: new TokenReader(t1.tokenList) });

    const t2 = c.tokenReader.current;
    if (Operator.matches(t2, ':')) {
      c.tokenReader.consume();

      const _returnType = this.typeReader.read(c);
      if (_returnType === INVALID) {
        return INVALID;
      }
      if (!_returnType) {
        c.parseErrors.addError(`Expected type`, t2.pos);
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
