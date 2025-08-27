import { ERROR, INVALID, Invalid, Pos } from '@/base';
import { ParserContext } from '@/beans/parser/parser-context';
import { Identifier } from '@/beans/tokenizer/identifier';
import { Keyword } from '@/beans/tokenizer/keyword';
import { SimpleType } from '@/beans/type/simple-type';
import { Type } from '@/beans/type/type';
import { Bean } from '@/util/beans';
import { TypeItemReader } from './type-item-reader';

export class SimpleTypeReader extends Bean implements TypeItemReader {
  read(c: ParserContext): Type | Invalid | undefined {
    const t1 = c.current;
    if (Keyword.matches(t1) || Identifier.matches(t1)) {
      c.consume();
      return this.process(c, t1.name, t1.pos);
    }
  }

  private process(c: ParserContext, name: string, pos: Pos): Type | Invalid {
    if (name === 'string' || name === 'number') {
      return new SimpleType(name, pos);
    }
    c.addError({
      level: ERROR,
      message: `I still don't understand type "${name}"`,
      pos,
    });
    return INVALID;
  }

  isAssignable(type: Type, assignTo: Type): boolean | undefined {
    if (type instanceof SimpleType && assignTo instanceof SimpleType) {
      return type.primitive === assignTo.primitive;
    }
  }
}
