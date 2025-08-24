import { Pos } from '@/base';
import { L3Base } from '@/beans/l3-parser/l3-base';
import { L3Type } from '@/beans/type/l3-type';

export abstract class L3Expression extends L3Base {
  type: L3Type;
  abstract get isReference(): boolean;

  constructor(type: L3Type, pos: Pos) {
    super(pos);
    this.type = type;
  }
}
