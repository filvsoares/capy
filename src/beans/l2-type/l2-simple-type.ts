import { Pos } from '@/beans/base';
import { L2Type } from './l2-type';
import { L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L1Identifier, L1Keyword } from '../l1-reader/l1-word';

export class L2SimpleType extends L2Type {
  name: string;

  constructor(name: string, pos: Pos) {
    super(pos);
    this.name = name;
  }

  toString(): string {
    return `type ${this.name}`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  name: ${this.name}\n`);
  }
}
