import { CodegenContext } from '@/modules/codegen/codegen';
import { Expression } from '@/modules/expression/expression';
import { declareBeanInterface } from '@/util/beans';

export type ExpressionProcessorContext = CodegenContext;

export interface ExpressionProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[];
}

export const expressionProcessor = declareBeanInterface<ExpressionProcessor>('ExpressionProcessor');
