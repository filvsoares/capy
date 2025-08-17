import { Pos } from '../base';
import { readExpressionStatement } from './l2-expression-statement';
import { readReturnStatement } from './l2-return-statement';
import { readStatementList } from './l2-statement-list';
import { L2Base, L2ParseContext, ReadResult } from './l2-types';
import { readVariable } from './l2-variable';

export abstract class L2Statement extends L2Base {
  constructor(pos: Pos) {
    super(pos);
  }
}

export function readStatement(c: L2ParseContext): ReadResult<L2Statement> {
  return readReturnStatement(c) || readExpressionStatement(c) || readVariable(c) || readStatementList(c);
}
