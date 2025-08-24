import { Base, Pos } from '@/base';
import { Type } from '@/beans/type/type';

export abstract class Expression extends Base {
  type: Type;
  abstract get isReference(): boolean;

  constructor(type: Type, pos: Pos) {
    super(pos);
    this.type = type;
  }
}
