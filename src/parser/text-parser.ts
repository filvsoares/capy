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

export const WORD = 0;
export const OPERATOR = 1;
export const BRACKET = 2;
export const NUMBER = 3;
export const STRING = 4;
export const WHITESPACE = 5;

export type BaseToken = {
  type: number;
  lineStart: number;
  columnStart: number;
  lineEnd: number;
  columnEnd: number;
};

function isToken(val: Token | number): val is Token {
  return typeof val === 'object';
}

export type Word = BaseToken & {
  type: typeof WORD;
  value: string;
};

export type Operator = BaseToken & {
  type: typeof OPERATOR;
  value: string;
};

export type Bracket = BaseToken & {
  type: typeof BRACKET;
  value: string;
  tokenList: Token[];
};

export type Number = BaseToken & {
  type: typeof NUMBER;
  value: string;
};

export type String = BaseToken & {
  type: typeof STRING;
  value: string;
};

export type Token = Word | Operator | String | Bracket | Number;

export function tokenToString(t: Token | undefined) {
  if (!t) {
    return 'EOF';
  }
  switch (t.type) {
    case BRACKET:
      return `bracket "${t.value}"`;
    case NUMBER:
      return `number "${t.value}"`;
    case STRING:
      return `string "${t.value}"`;
    case OPERATOR:
      return `operator "${t.value}"`;
    case WORD:
      return `word "${t.value}"`;
  }
}

type ParseContext = {
  line: number;
  column: number;
  current: string;
  next: () => string;
};

export class ParseError extends Error {
  lineStart: number;
  columnStart: number;
  lineEnd: number;
  columnEnd: number;

  constructor(message: string, lineStart: number, columnStart: number, lineEnd?: number, columnEnd?: number) {
    super(`[${lineStart}:${columnStart} - ${lineEnd}:${columnEnd}] ${message}`);
    this.lineStart = lineStart;
    this.columnStart = columnStart;
    this.lineEnd = lineEnd ?? lineStart;
    this.columnEnd = columnEnd ?? columnStart;
  }
}

function readWord(ctx: ParseContext): Word | undefined {
  if (!isWordStart(ctx.current)) {
    return;
  }
  const word: Word = {
    type: WORD,
    value: ctx.current,
    lineStart: ctx.line,
    columnStart: ctx.column,
    lineEnd: ctx.line,
    columnEnd: ctx.column,
  };
  while (isWordMiddle(ctx.next())) {
    word.value += ctx.current;
    word.lineEnd = ctx.line;
    word.columnEnd = ctx.column;
  }
  return word;
}

function readNumber(ctx: ParseContext): Number | undefined {
  if (!isNumberStart(ctx.current)) {
    return;
  }
  const number: Number = {
    type: NUMBER,
    value: ctx.current,
    lineStart: ctx.line,
    columnStart: ctx.column,
    lineEnd: ctx.line,
    columnEnd: ctx.column,
  };
  while (isNumberMiddle(ctx.next())) {
    number.value += ctx.current;
    number.lineEnd = ctx.line;
    number.columnEnd = ctx.column;
  }
  return number;
}

function readWhitespace(ctx: ParseContext): typeof WHITESPACE | undefined {
  if (!isWhitespace(ctx.current)) {
    return;
  }
  while (isWhitespace(ctx.next())) {}
  return WHITESPACE;
}

function readOperator(ctx: ParseContext): Operator | undefined {
  if (!isOperator(ctx.current)) {
    return;
  }
  const operator: Operator = {
    type: OPERATOR,
    value: ctx.current,
    lineStart: ctx.line,
    columnStart: ctx.column,
    lineEnd: ctx.line,
    columnEnd: ctx.column,
  };
  while (ctx.next() && isOperator(operator.value + ctx.current)) {
    operator.value += ctx.current;
    operator.lineEnd = ctx.line;
    operator.columnEnd = ctx.column;
  }
  return operator;
}

function readBracket(ctx: ParseContext): Bracket | undefined {
  if (!isBracketStart(ctx.current)) {
    return;
  }
  const bracketStart = ctx.current;
  const lineStart = ctx.line;
  const columnStart = ctx.column;
  if (!ctx.next()) {
    throw new ParseError('Unexpected EOF', ctx.line, ctx.column);
  }

  const tokenList: Token[] = [];
  while (true) {
    if (isBracketEnd(ctx.current)) {
      break;
    }
    const val = readSomething(ctx);
    if (isToken(val)) {
      tokenList.push(val);
    }
  }

  const bracketEnd = ctx.current;
  const expectedBracketEnd = bracketStart === '(' ? ')' : bracketStart === '[' ? ']' : bracketStart === '{' ? '}' : '';
  if (bracketEnd !== expectedBracketEnd) {
    throw new ParseError(`Expected "${expectedBracketEnd}" but found ${bracketEnd}`, ctx.line, ctx.column);
  }

  const bracket: Bracket = {
    type: BRACKET,
    value: bracketStart,
    lineStart,
    columnStart,
    lineEnd: ctx.line,
    columnEnd: ctx.column,
    tokenList,
  };

  ctx.next();
  return bracket;
}

function readString(ctx: ParseContext): String | undefined {
  if (ctx.current !== '"') {
    return;
  }
  const string: String = {
    type: STRING,
    value: '',
    lineStart: ctx.line,
    columnStart: ctx.column,
    lineEnd: ctx.line,
    columnEnd: ctx.column,
  };
  while (true) {
    if (!ctx.next()) {
      throw new ParseError('Unexpected EOF', ctx.line, ctx.column);
    }
    if (ctx.current === '"') {
      break;
    }
    string.value += ctx.current;
    string.lineEnd = ctx.line;
    string.columnEnd = ctx.column;
  }
  ctx.next();
  return string;
}

function readSomething(ctx: ParseContext): Token | number {
  const result =
    readWhitespace(ctx) || readWord(ctx) || readOperator(ctx) || readBracket(ctx) || readNumber(ctx) || readString(ctx);

  if (!result) {
    throw new ParseError(`Unexpected char "${ctx.current}"`, ctx.line, ctx.column);
  }

  return result;
}

export function parseText(s: string) {
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

  const tokenList: Token[] = [];
  while (ctx.current) {
    const val = readSomething(ctx);
    if (isToken(val)) {
      tokenList.push(val);
    }
  }
  return tokenList;
}
