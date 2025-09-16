import { Invalid } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { ExpressionReaderContext } from '@/modules/expression/expression-reader';
import { Token } from '@/modules/tokenizer/token';
import { declareBeanInterface } from '@/util/beans';

export type ProcessToken = Expression | Token;
export type ProcessResult = { result: Expression; skip: number } | Invalid | undefined;

export interface OperationProcessor {
  pass: number;
  process(c: ExpressionReaderContext, t1: ProcessToken, t2?: ProcessToken, t3?: ProcessToken): ProcessResult;
}

export const operationProcessor = declareBeanInterface<OperationProcessor>('OperationProcessor');
