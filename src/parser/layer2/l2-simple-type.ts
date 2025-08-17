import { Pos } from '../base';
import { L1Identifier, L1Keyword } from '../layer1/l1-word';
import { L2Type } from './l2-type';
import { L2ParseContext, ReadResult } from './l2-types';

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

export function readSimpleType(c: L2ParseContext): ReadResult<L2SimpleType> {
  const t1 = c.current;
  if (L1Keyword.matches(t1) || L1Identifier.matches(t1)) {
    c.consume();
    return new L2SimpleType(t1.name, t1.pos);
  }
}
