import { CodegenData } from '@/modules/codegen/codegen/codegen-data';
import { Expression } from '@/modules/parser/expression/expression';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';

export type ExpressionProcessorContext = Context<CodegenData>;

export interface ExpressionProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[];
}

export const expressionProcessor = declareBeanInterface<ExpressionProcessor>('ExpressionProcessor');
