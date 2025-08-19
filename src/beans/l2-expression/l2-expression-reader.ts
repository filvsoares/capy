import { declareBeanInterface } from '@/util/beans';
import { L1Base } from '../l1-parser/l1-types';
import { Invalid, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2Expression, L2Operation, L2OperationStep } from './l2-expression';

export type ReadExpressionOpts = {
  unexpectedTokenErrorMsg?: (t: L1Base | L2Expression) => string;
};

export interface L2ExpressionReader {
  read(c: L2ParseContext, opts?: ReadExpressionOpts): ReadResult<L2Expression>;
  readList(c: L2ParseContext, opts?: ReadExpressionOpts): L2Expression[];
  isOperand(token: L1Base | L2Expression | undefined): boolean;
  unwrapOperand(c: L2ParseContext, operand: L1Base | L2Expression): L2Expression | Invalid;
  createOperation(c: L2ParseContext, t1: L1Base | L2Expression, step: L2OperationStep): L2Operation | Invalid;
}

export const l2ExpressionReader = declareBeanInterface<L2ExpressionReader>('L2ExpressionReader');
