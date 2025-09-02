import { ExpressionProcessorContext } from '@/modules/codegen/expression/expression-processor';
import { Expression } from '@/modules/parser/expression/expression';
import { declareBeanInterface } from '@/util/beans';

export interface ExpressionItemProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined;
}

export const expressionItemProcessor = declareBeanInterface<ExpressionItemProcessor>('ExpressionItemProcessor');
