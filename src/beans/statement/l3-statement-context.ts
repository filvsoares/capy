import { L3ExpressionContext } from '@/beans/expression/l3-expression-processor';

export interface L3StatementContext extends L3ExpressionContext {
  createChild(): L3StatementContext;
}
