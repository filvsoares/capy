import { INVALID, Invalid, Pos } from '@/base';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { Keyword } from '@/modules/parser/tokenizer/keyword';
import { SimpleType } from '@/modules/parser/type/simple-type';
import { Type } from '@/modules/parser/type/type';
import { TypeReaderContext } from '@/modules/parser/type/type-reader';
import { Bean } from '@/util/beans';
import { TypeItemReader } from './type-item-reader';

export class SimpleTypeReader extends Bean implements TypeItemReader {
  read(c: TypeReaderContext): Type | Invalid | undefined {
    const t1 = c.tokenReader.current;
    if (Keyword.matches(t1) || Identifier.matches(t1)) {
      c.tokenReader.consume();
      return this.process(c, t1.name, t1.pos);
    }
  }

  private process(c: TypeReaderContext, name: string, pos: Pos): Type | Invalid {
    if (name === 'string' || name === 'number') {
      return new SimpleType(name, pos);
    }
    c.parseErrors.addError(`I still don't understand type "${name}"`, pos);
    return INVALID;
  }

  isAssignable(type: Type, assignTo: Type): boolean | undefined {
    if (type instanceof SimpleType && assignTo instanceof SimpleType) {
      return type.primitive === assignTo.primitive;
    }
  }
}
