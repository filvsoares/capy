import { ERROR } from '@/base';
import { Bracket } from '@/beans/parser/bracket';
import { Parser, TokenizerContext } from '@/beans/parser/parser';
import { Token } from '@/beans/parser/token';
import { TokenReader } from '@/beans/parser/token-reader';
import { Bean } from '@/util/beans';

function isBracketStart(c: string) {
  return c === '(' || c === '[' || c === '{';
}

function isBracketEnd(c: string) {
  return c === ')' || c === ']' || c === '}';
}

export class BracketReader extends Bean implements TokenReader {
  constructor(private parser: Parser) {
    super();
    this.parser = parser;
  }

  read(c: TokenizerContext): Bracket | undefined {
    if (!isBracketStart(c.current())) {
      return;
    }

    const bracketStart = c.current();
    const expectedBracketEnd =
      bracketStart === '(' ? ')' : bracketStart === '[' ? ']' : bracketStart === '{' ? '}' : '';
    const lin1 = c.lin();
    const col1 = c.col();

    c.consume();

    const list: Token[] = [];
    while (true) {
      if (!c.current()) {
        c.addError({
          level: ERROR,
          pos: { lin1: c.lin(), col1: c.col(), lin2: c.lin(), col2: c.col() },
          message: `Expected "${expectedBracketEnd}"`,
        });
        break;
      }
      if (isBracketEnd(c.current())) {
        break;
      }
      const item = this.parser.readToken(c);
      if (!item) {
        c.addError({
          level: ERROR,
          pos: { lin1: c.lin(), col1: c.col(), lin2: c.lin(), col2: c.col() + 1 },
          message: `Unexpected char "${c.current()}"`,
        });
        c.consume();
      }
      if (item instanceof Token) {
        list.push(item);
      }
    }

    const lin2 = c.lin();
    const col2 = c.col() + 1;

    if (c.current()) {
      if (c.current() !== expectedBracketEnd) {
        c.addError({
          level: ERROR,
          pos: { lin1: c.lin(), col1: c.col(), lin2: c.lin(), col2: c.col() + 1 },
          message: `Expected "${expectedBracketEnd}" but found ${c.current()}`,
        });
      }
      c.consume();
    }

    return new Bracket(bracketStart, expectedBracketEnd, list, { lin1, col1, lin2, col2 });
  }
}
