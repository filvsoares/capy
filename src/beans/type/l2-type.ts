import { Pos } from '@/base';
import { L2Base } from '../l2-parser/l2-base';

export abstract class L2Type extends L2Base {
  constructor(pos: Pos) {
    super(pos);
  }
}
