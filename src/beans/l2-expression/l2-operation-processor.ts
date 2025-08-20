import { declareBeanInterface } from '@/util/beans';
import { L1Base } from '../l1-parser/l1-types';
import { Invalid, L2ParseContext } from '../l2-parser/l2-types';
import { L2Expression, L2OperationStep } from './l2-expression';

export type ProcessToken = L2Expression | L1Base;
export type ProcessResult = { step: L2OperationStep; skip: number } | Invalid | undefined;

export interface L2OperationProcessor {
  pass: number;
  process(c: L2ParseContext, t1: ProcessToken, t2?: ProcessToken, t3?: ProcessToken): ProcessResult;
}

export const l2OperationProcessor = declareBeanInterface<L2OperationProcessor>('L2OperationProcessor');
