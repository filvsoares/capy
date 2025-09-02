import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { Expression } from '@/modules/parser/expression/expression';
import { declareBeanInterface } from '@/util/beans';

export interface ExpressionItemProcessor {
  processExpression(c: CodegenContext, obj: Expression): string[] | undefined;
}

export const expressionItemProcessor = declareBeanInterface<ExpressionItemProcessor>('ExpressionItemProcessor');
