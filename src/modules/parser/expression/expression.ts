import { Base, Pos } from '@/base';
import { Type } from '@/modules/parser/type/type';

export abstract class Expression extends Base {
  type: Type;

  constructor(type: Type, pos: Pos) {
    super(pos);
    this.type = type;
  }

  get isReference() {
    return false;
  }
}
