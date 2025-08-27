import { Invalid } from '@/base';
import { ParserContext } from '@/beans/parser/parser-context';
import { Bean } from '@/util/beans';
import { Type } from './type';
import { TypeItemReader } from './type-item-reader';
import { TypeReader } from './type-reader';

export class TypeReaderImpl extends Bean implements TypeReader {
  constructor(private itemReaders: TypeItemReader[]) {
    super();
    this.itemReaders = itemReaders;
  }

  read(c: ParserContext): Type | Invalid | undefined {
    for (const itemReader of this.itemReaders) {
      const result = itemReader.read(c);
      if (result) {
        return result;
      }
    }
  }

  isAssignable(type: Type, assignTo: Type) {
    for (const p of this.itemReaders) {
      const result = p.isAssignable(type, assignTo);
      if (typeof result === 'boolean') {
        return result;
      }
    }
    return false;
  }
}
