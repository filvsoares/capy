import { ExpressionContext } from '@/modules/parser/expression/expression-reader';
import { Type } from '@/modules/parser/type/type';

export interface StatementContext extends ExpressionContext {
  returnType: Type;
  createChild(): StatementContext;
}
