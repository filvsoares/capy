import { ParseError } from './base';
import { L1Bracket, L1Number, L1Operator, L1String, L1Base, L1Word, L1BasePos } from './l1-types';

function isWordStart(c: string) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
}

function isWordMiddle(c: string) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '_';
}

function isWhitespace(c: string) {
  return c === ' ' || c === '\t' || c === '\r' || c === '\n';
}

function isBracketStart(c: string) {
  return c === '(' || c === '[' || c === '{';
}

function isBracketEnd(c: string) {
  return c === ')' || c === ']' || c === '}';
}

function isNumberStart(c: string) {
  return c >= '0' && c <= '9';
}

function isNumberMiddle(c: string) {
  return (c >= '0' && c <= '9') || c == '.';
}

type OperatorMap = { [name: string]: true | OperatorMap };

const operatorMap: OperatorMap = {
  '=': { '=': true },
  '+': true,
  '-': true,
  '*': true,
  '/': true,
  ';': true,
  ':': true,
  ',': true,
  '.': true,
};

function isOperator(s: string) {
  let currentMapPos: OperatorMap | true = operatorMap;
  for (const c of s) {
    if (currentMapPos === true) {
      /* Map has ended but there are still chars in the string */
      return false;
    }
    currentMapPos = currentMapPos[c];
    if (!currentMapPos) {
      /* Not found */
      return false;
    }
  }
  return true;
}

type ParseContext = {
  line: number;
  column: number;
  current: string;
  next: () => string;
};

function readWord(ctx: ParseContext): L1Word | undefined {
  if (!isWordStart(ctx.current)) {
    return;
  }
  let value = ctx.current;
  const lin1 = ctx.line;
  const col1 = ctx.column;
  let lin2 = ctx.line;
  let col2 = ctx.column + 1;
  while (isWordMiddle(ctx.next())) {
    value += ctx.current;
    lin2 = ctx.line;
    col2 = ctx.column + 1;
  }
  return new L1Word(value, { lin1, col1, lin2, col2 });
}

function readNumber(ctx: ParseContext): L1Number | undefined {
  if (!isNumberStart(ctx.current)) {
    return;
  }
  let value = ctx.current;
  const lin1 = ctx.line;
  const col1 = ctx.column;
  let lin2 = ctx.line;
  let col2 = ctx.column + 1;
  while (isNumberMiddle(ctx.next())) {
    value += ctx.current;
    lin2 = ctx.line;
    col2 = ctx.column + 1;
  }
  return new L1Number(value, { lin1, col1, lin2, col2 });
}

function readWhitespace(ctx: ParseContext): true | undefined {
  if (!isWhitespace(ctx.current)) {
    return;
  }
  while (isWhitespace(ctx.next())) {}
  return true;
}

function readOperator(ctx: ParseContext): L1Operator | undefined {
  if (!isOperator(ctx.current)) {
    return;
  }
  let value = ctx.current;
  const lin1 = ctx.line;
  const col1 = ctx.column;
  let lin2 = ctx.line;
  let col2 = ctx.column + 1;
  while (ctx.next() && isOperator(value + ctx.current)) {
    value += ctx.current;
    lin2 = ctx.line;
    col2 = ctx.column + 1;
  }
  return new L1Operator(value, { lin1, col1, lin2, col2 });
}

function readBracket(ctx: ParseContext): L1Bracket | undefined {
  if (!isBracketStart(ctx.current)) {
    return;
  }

  const bracketStart = ctx.current;
  const expectedBracketEnd = bracketStart === '(' ? ')' : bracketStart === '[' ? ']' : bracketStart === '{' ? '}' : '';
  const lin1 = ctx.line;
  const col1 = ctx.column;

  if (!ctx.next()) {
    throw new ParseError('Unexpected EOF', ctx.line, ctx.column);
  }

  const list: L1BasePos[] = [];
  while (true) {
    if (isBracketEnd(ctx.current)) {
      break;
    }
    const token = read(ctx);
    if (!token) {
      throw new ParseError(`Unexpected char "${ctx.current}"`, ctx.line, ctx.column);
    }
    if (token instanceof L1Base) {
      list.push(token);
    }
  }

  const bracketEnd = ctx.current;
  if (bracketEnd !== expectedBracketEnd) {
    throw new ParseError(`Expected "${expectedBracketEnd}" but found ${bracketEnd}`, ctx.line, ctx.column);
  }
  const lin2 = ctx.line;
  const col2 = ctx.column + 1;

  ctx.next();
  return new L1Bracket(bracketStart, expectedBracketEnd, list, { lin1, col1, lin2, col2 });
}

function readString(ctx: ParseContext): L1String | undefined {
  if (ctx.current !== '"') {
    return;
  }
  let value = '';
  const lin1 = ctx.line;
  const col1 = ctx.column;
  let lin2 = ctx.line;
  let col2 = ctx.column + 1;

  while (true) {
    if (!ctx.next()) {
      throw new ParseError('Unexpected EOF', ctx.line, ctx.column);
    }
    if (ctx.current === '"') {
      break;
    }
    value += ctx.current;
    lin2 = ctx.line;
    col2 = ctx.column + 1;
  }
  ctx.next();
  return new L1String(value, { lin1, col1, lin2, col2 });
}

function read(ctx: ParseContext): L1BasePos | true | undefined {
  return (
    readWhitespace(ctx) || readWord(ctx) || readOperator(ctx) || readBracket(ctx) || readNumber(ctx) || readString(ctx)
  );
}

export function layer1Parse(s: string): L1BasePos[] {
  let pos = 0;

  const ctx: ParseContext = {
    current: s[0],
    line: 1,
    column: 1,
    next: () => {
      if (!ctx.current) {
        return '';
      }
      pos++;
      if (pos >= s.length) {
        ctx.current = '';
        return '';
      }
      if (ctx.current === '\n') {
        ctx.column = 1;
        ctx.line++;
      } else {
        ctx.column++;
      }
      ctx.current = s[pos];
      return ctx.current;
    },
  };

  const tokenList: L1BasePos[] = [];
  while (ctx.current) {
    const token = read(ctx);
    if (!token) {
      throw new ParseError(`Unexpected char "${ctx.current}"`, ctx.line, ctx.column);
    }
    if (token instanceof L1BasePos) {
      tokenList.push(token);
    }
  }
  return tokenList;
}
