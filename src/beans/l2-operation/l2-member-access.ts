import { Pos } from '../base';
import { L2OperationStep } from '../l2-expression/l2-expression';

export class L2MemberAccess extends L2OperationStep {
  member: string;

  constructor(member: string, pos: Pos) {
    super(pos);
    this.member = member;
  }

  toString(): string {
    return 'member access';
  }
}
