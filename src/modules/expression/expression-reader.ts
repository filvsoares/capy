import { Invalid } from '@/base';
import { Expression } from '@/modules/expression/expression';
import { ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { Identifier } from '@/modules/tokenizer/identifier';
import { Token } from '@/modules/tokenizer/token';
import { declareBeanInterface } from '@/util/beans';

export type ReadExpressionOpts = {
  unexpectedTokenErrorMsg?: (t: Token | Expression) => string;
};

export type ExpressionReaderContext = ToplevelReaderContext;

export interface ExpressionReader {
  read(c: ExpressionReaderContext, opts?: ReadExpressionOpts): Expression | Invalid | undefined;
  readList(c: ExpressionReaderContext, opts?: ReadExpressionOpts): Expression[];
  isOperand(obj: Token | Expression | undefined): obj is Token | Expression;
  resolveOperand(c: ExpressionReaderContext, obj: Token | Expression, dereference: boolean): Expression | Invalid;
  resolveIdentifier(c: ExpressionReaderContext, name: string, origin: Identifier): Expression | Invalid;
}

export const expressionReader = declareBeanInterface<ExpressionReader>('ExpressionReader');
