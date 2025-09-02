import { Invalid } from '@/base';
import { Expression } from '@/modules/parser/expression/expression';
import { CurrentModule } from '@/modules/parser/parser/current-module';
import { ParserData } from '@/modules/parser/parser/parser-data';
import { TokenReader } from '@/modules/parser/parser/token-reader';
import { Token } from '@/modules/parser/tokenizer/token';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';
import { ParseErrors } from '@/util/parse-errors';

export type ReadExpressionOpts = {
  unexpectedTokenErrorMsg?: (t: Token | Expression) => string;
};

export type ExpressionReaderContext = Context<ParserData & TokenReader & CurrentModule & ParseErrors>;

export interface ExpressionReader {
  read(c: ExpressionReaderContext, opts?: ReadExpressionOpts): Expression | Invalid | undefined;
  readList(c: ExpressionReaderContext, opts?: ReadExpressionOpts): Expression[];
  isOperand(obj: Token | Expression | undefined): obj is Token | Expression;
  resolveOperand(c: ExpressionReaderContext, obj: Token | Expression, dereference: boolean): Expression | Invalid;
}

export const expressionReader = declareBeanInterface<ExpressionReader>('ExpressionReader');
