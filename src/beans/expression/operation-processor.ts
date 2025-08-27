import { Invalid } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { ExpressionContext } from '@/beans/expression/expression-reader';
import { ParserContext } from '@/beans/parser/parser-context';
import { Token } from '@/beans/tokenizer/token';
import { declareBeanInterface } from '@/util/beans';

export type ProcessToken = Expression | Token;
export type ProcessResult = { result: Expression; skip: number } | Invalid | undefined;

export interface OperationProcessor {
  pass: number;
  process(
    c: ParserContext,
    context: ExpressionContext | null,
    t1: ProcessToken,
    t2?: ProcessToken,
    t3?: ProcessToken
  ): ProcessResult;
}

export const operationProcessor = declareBeanInterface<OperationProcessor>('OperationProcessor');
