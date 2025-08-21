import { declareBeanInterface } from '@/util/beans';
import { L1Base } from '../l1-parser/l1-types';
import { Invalid, L2ParseContext, ReadResult } from '../l2-parser/l2-base';
import { L2Expression } from './l2-expression';

export type ReadExpressionOpts = {
  unexpectedTokenErrorMsg?: (t: L1Base | L2Expression) => string;
};

export interface L2ExpressionReader {
  read(c: L2ParseContext, opts?: ReadExpressionOpts): ReadResult<L2Expression>;
  readList(c: L2ParseContext, opts?: ReadExpressionOpts): L2Expression[];
  isOperand(token: L1Base | L2Expression | undefined): token is L1Base | L2Expression;
  unwrapOperand(c: L2ParseContext, operand: L1Base | L2Expression): L2Expression | Invalid;
}

export const l2ExpressionReader = declareBeanInterface<L2ExpressionReader>('L2ExpressionReader');
