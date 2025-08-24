import { Invalid } from '@/base';
import { Expression } from '@/beans/expression/expression';
import { ParserContext } from '@/beans/parser/parser';
import { Token } from '@/beans/parser/token';
import { declareBeanInterface } from '@/util/beans';

export interface ExpressionContext {}

export type ReadExpressionOpts = {
  unexpectedTokenErrorMsg?: (t: Token | Expression) => string;
};

export interface ExpressionReader {
  read(
    c: ParserContext,
    context: ExpressionContext | null,
    opts?: ReadExpressionOpts
  ): Expression | Invalid | undefined;
  readList(c: ParserContext, context: ExpressionContext | null, opts?: ReadExpressionOpts): Expression[];
  isOperand(token: Token | Expression | undefined): token is Token | Expression;
  unwrapOperand(c: ParserContext, operand: Token | Expression, context: ExpressionContext | null): Expression | Invalid;
}

export const expressionReader = declareBeanInterface<ExpressionReader>('ExpressionReader');
