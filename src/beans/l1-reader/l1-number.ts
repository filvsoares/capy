import { Pos } from '@/beans/base';
import { L1Base, L1ParseContext } from '@/beans/l1-parser/l1-types';
import { Bean } from '@/util/beans';
import { L1Reader } from '../l1-parser/l1-reader';

export class L1Number extends L1Base {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `number "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}
