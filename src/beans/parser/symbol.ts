import { Pos } from '@/base';
import { Toplevel } from '@/beans/parser/toplevel';

export abstract class Symbol extends Toplevel {
  constructor(public module: string, public name: string, pos: Pos) {
    super(pos);
  }
}
