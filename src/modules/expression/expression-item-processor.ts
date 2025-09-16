import { Expression } from '@/modules/expression/expression';
import { ExpressionProcessorContext } from '@/modules/expression/expression-processor';
import { declareBeanInterface } from '@/util/beans';

export interface ExpressionItemProcessor {
  processExpression(c: ExpressionProcessorContext, obj: Expression): string[] | undefined;
}

export const expressionItemProcessor = declareBeanInterface<ExpressionItemProcessor>('ExpressionItemProcessor');
