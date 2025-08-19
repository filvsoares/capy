import { declareBeanInterface } from '@/util/beans';
import { Invalid, L2Base, L2ParseContext, ReadResult } from '../l2-parser/l2-types';
import { L2Expression, L2Operation, L2OperationStep } from './l2-expression';
import { L1Base } from '../l1-parser/l1-types';

export interface L2OperationProcessor {
  pass: number;
  process(
    c: L2ParseContext,
    t1: L2Expression | L1Base,
    t2?: L2Expression | L1Base,
    t3?: L2Expression | L1Base
  ): { step: L2OperationStep; skip: number } | Invalid | undefined;
}

export const l2OperationProcessor = declareBeanInterface<L2OperationProcessor>('L2OperationProcessor');
