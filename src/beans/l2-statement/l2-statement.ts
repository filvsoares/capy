import { Pos } from '@/beans/base';
import { L2Base } from '../l2-parser/l2-types';

export abstract class L2Statement extends L2Base {
  constructor(pos: Pos) {
    super(pos);
  }
}
