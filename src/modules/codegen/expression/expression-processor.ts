import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { Expression } from '@/modules/parser/expression/expression';
import { declareBeanInterface } from '@/util/beans';

export interface ExpressionProcessor {
  processExpression(c: CodegenContext, obj: Expression): string[];
}

export const expressionProcessor = declareBeanInterface<ExpressionProcessor>('ExpressionProcessor');
