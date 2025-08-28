import { Invalid } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { ParserContext } from '@/modules/parser/parser/parser-context';
import { Token } from '@/modules/parser/tokenizer/token';
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
  isOperand(obj: Token | Expression | undefined): obj is Token | Expression;
  resolveOperand(
    c: ParserContext,
    obj: Token | Expression,
    context: ExpressionContext | null,
    dereference: boolean
  ): Expression | Invalid;
}

export const expressionReader = declareBeanInterface<ExpressionReader>('ExpressionReader');
