import { Base, Pos } from '@/base';

export abstract class Statement extends Base {
  constructor(pos: Pos) {
    super(pos);
  }
}
