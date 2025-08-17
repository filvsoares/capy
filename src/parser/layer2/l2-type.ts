import { Pos } from '../base';
import { L2Base } from './l2-types';

export abstract class L2Type extends L2Base {
  constructor(pos: Pos) {
    super(pos);
  }
}
