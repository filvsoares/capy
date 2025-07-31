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

export abstract class Token {
  lineStart = 0;
  columnStart = 0;
  lineEnd = 0;
  columnEnd = 0;

  setStart(line: number, column: number) {
    this.lineStart = line;
    this.columnStart = column;
    if (this.lineEnd < line || (this.lineEnd === line && this.columnEnd <= column)) {
      this.lineEnd = line;
      this.columnEnd = column + 1;
    }
  }

  setEnd(line: number, column: number) {
    this.lineEnd = line;
    this.columnEnd = column;
  }

  abstract toString(): string;

  static toString(token: Token | undefined) {
    return token?.toString() ?? 'nothing';
  }
}

export class Word extends Token {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `word "${this.value}"`;
  }
}

export class Operator extends Token {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `operator "${this.value}"`;
  }
}

export class Bracket extends Token {
  value: string;
  tokenList: Token[];

  constructor(value: string, tokenList: Token[]) {
    super();
    this.value = value;
    this.tokenList = tokenList;
  }

  toString(): string {
    return `bracket "${this.value}"`;
  }
}

export class Number extends Token {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `number "${this.value}"`;
  }
}

export class String extends Token {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `string "${this.value}"`;
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
  const val = new Word(ctx.current);
  val.setStart(ctx.line, ctx.column);
  while (isWordMiddle(ctx.next())) {
    val.value += ctx.current;
    val.setEnd(ctx.line, ctx.column + 1);
  }
  return val;
}

function readNumber(ctx: ParseContext): Number | undefined {
  if (!isNumberStart(ctx.current)) {
    return;
  }
  const val = new Number(ctx.current);
  val.setStart(ctx.line, ctx.column);
  while (isNumberMiddle(ctx.next())) {
    val.value += ctx.current;
    val.setEnd(ctx.line, ctx.column + 1);
  }
  return val;
}

function readWhitespace(ctx: ParseContext): true | undefined {
  if (!isWhitespace(ctx.current)) {
    return;
  }
  while (isWhitespace(ctx.next())) {}
  return true;
}

function readOperator(ctx: ParseContext): Operator | undefined {
  if (!isOperator(ctx.current)) {
    return;
  }
  const val = new Operator(ctx.current);
  val.setStart(ctx.line, ctx.column);
  while (ctx.next() && isOperator(val.value + ctx.current)) {
    val.value += ctx.current;
    val.setEnd(ctx.line, ctx.column + 1);
  }
  return val;
}

function readBracket(ctx: ParseContext): Bracket | undefined {
  if (!isBracketStart(ctx.current)) {
    return;
  }

  const val = new Bracket(ctx.current, []);
  val.setStart(ctx.line, ctx.column);

  if (!ctx.next()) {
    throw new ParseError('Unexpected EOF', ctx.line, ctx.column);
  }

  while (true) {
    if (isBracketEnd(ctx.current)) {
      break;
    }
    const token = read(ctx);
    if (token instanceof Token) {
      val.tokenList.push(token);
    }
  }

  const bracketEnd = ctx.current;
  const expectedBracketEnd = val.value === '(' ? ')' : val.value === '[' ? ']' : val.value === '{' ? '}' : '';
  if (bracketEnd !== expectedBracketEnd) {
    throw new ParseError(`Expected "${expectedBracketEnd}" but found ${bracketEnd}`, ctx.line, ctx.column);
  }
  val.setEnd(ctx.line, ctx.column + 1);

  ctx.next();
  return val;
}

function readString(ctx: ParseContext): String | undefined {
  if (ctx.current !== '"') {
    return;
  }
  const val = new String('');
  val.setStart(ctx.line, ctx.column);

  while (true) {
    if (!ctx.next()) {
      throw new ParseError('Unexpected EOF', ctx.line, ctx.column);
    }
    if (ctx.current === '"') {
      break;
    }
    val.setEnd(ctx.line, ctx.column + 1);
  }
  ctx.next();
  return val;
}

function read(ctx: ParseContext): Token | true {
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
    const token = read(ctx);
    if (token instanceof Token) {
      tokenList.push(token);
    }
  }
  return tokenList;
}
