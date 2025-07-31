import { Bracket, Operator, ParseError, String, Token, Word } from './text-parser';

type ParseContext = {
  current: Token | undefined;
  next: () => Token | undefined;
};

function isWord(token: Token | undefined, value?: string): token is Word {
  return !!token && token instanceof Word && (value === undefined || token.value === value);
}

function isString(token: Token | undefined, value?: string): token is String {
  return !!token && token instanceof String && (value === undefined || token.value === value);
}

function isOperator(token: Token | undefined, value?: string): token is Operator {
  return !!token && token instanceof Operator && (value === undefined || token.value === value);
}

function isBracket(token: Token | undefined, value?: string): token is Bracket {
  return !!token && token instanceof Bracket && (value === undefined || token.value === value);
}

export class Use extends Token {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return `use "${this.value}"`;
  }
}

export class Method extends Token {
  name: string;
  returnType?: Type;
  statementList: Token[];

  constructor(name: string, returnType?: Type, statementList: Token[]) {
    super();
    this.name = name;
    this.returnType = returnType;
    this.statementList = statementList;
  }

  toString(): string {
    return `method "${this.name}"`;
  }
}

export class Variable extends Token {
  name: string;
  type: Type;

  constructor(name: string, type: Type) {
    super();
    this.name = name;
    this.type = type;
  }

  toString(): string {
    return `variable "${this.name}"`;
  }
}

export class Type extends Token {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  toString(): string {
    return `type "${this.name}"`;
  }
}

export class Expression extends Token {
  tokenList: Token[];

  constructor(tokenList: Token[]) {
    super();
    this.tokenList = tokenList;
  }

  toString(): string {
    return `expression`;
  }
}

function readUse(ctx: ParseContext): Use | undefined {
  const t1 = ctx.current;
  if (!isWord(t1, 'use')) {
    return;
  }

  const t2 = ctx.next();
  if (!isString(t2)) {
    throw new ParseError(
      `Expected string`,
      t2?.lineStart ?? t1.lineEnd,
      t2?.columnStart ?? t1.columnEnd,
      t2?.lineEnd,
      t2?.columnEnd
    );
  }

  const t3 = ctx.next();
  if (!isOperator(t3, ';')) {
    throw new ParseError(
      `Expected ";"`,
      t3?.lineStart ?? t2.lineEnd,
      t3?.columnStart ?? t2.columnEnd,
      t3?.lineEnd,
      t3?.columnEnd
    );
  }

  ctx.next();

  const val = new Use(t2.value);
  val.setStart(t1.lineStart, t1.columnStart);
  val.setEnd(t3.lineEnd, t3.columnEnd);
  return val;
}

function readDef(ctx: ParseContext): Method | Variable | undefined {
  const t1 = ctx.current;
  if (!isWord(t1, 'def')) {
    return;
  }

  const t2 = ctx.next();
  if (!isWord(t2)) {
    throw new ParseError(
      `Expected definition name`,
      t2?.lineStart ?? t1.lineEnd,
      t2?.columnStart ?? t1.columnEnd,
      t2?.lineEnd,
      t2?.columnEnd
    );
  }

  const t3 = ctx.next();
  if (isBracket(t3, '(')) {
    return readDefMethod(t1, t2, t3, ctx);
  } else if (isOperator(t3, ':')) {
    return readDefVariable(t1, t2, t3, ctx);
  }

  throw new ParseError(
    `Expected "(" or ":" but found ${Token.toString(t3)}`,
    t3?.lineStart ?? t2.lineEnd,
    t3?.columnStart ?? t2.columnEnd,
    t3?.lineEnd,
    t3?.columnEnd
  );
}

function readDefMethod(t1: Word, t2: Word, t3: Bracket, ctx: ParseContext): Method | undefined {
  let returnType: Type | undefined;

  let t4 = ctx.next();

  if (isOperator(t4, ':')) {
    ctx.next();
    returnType = readType(ctx);
    if (!returnType) {
      throw new ParseError(
        `Expected return type but found ${Token.toString(t4)}`,
        t4?.lineStart ?? t3.lineEnd,
        t4?.columnStart ?? t3.columnEnd,
        t4?.lineEnd,
        t4?.columnEnd
      );
    }
    t4 = ctx.current;
  }

  if (!isBracket(t4, '{')) {
    throw new ParseError(
      `Expected "{" but found ${Token.toString(t4)}`,
      t4?.lineStart ?? t3.lineEnd,
      t4?.columnStart ?? t3.columnEnd,
      t4?.lineEnd,
      t4?.columnEnd
    );
  }

  ctx.next();

  const val = new Method(t2.value, returnType, parseStatements(t4.tokenList));
  val.setStart(t1.lineStart, t1.columnStart);
  val.setEnd(t3.lineEnd, t3.columnEnd);
  return val;
}

function readType(ctx: ParseContext): Type | undefined {
  const t1 = ctx.current;
  if (!isWord(t1)) {
    return undefined;
  }

  ctx.next();

  const val = new Type(t1.value);
  val.setStart(t1.lineStart, t1.columnStart);
  val.setEnd(t1.lineEnd, t1.columnEnd);
  return val;
}

function readDefVariable(t1: Word, t2: Word, t3: Operator, ctx: ParseContext): Variable | undefined {
  const t4 = ctx.next();
  const type = readType(ctx);
  if (!type) {
    throw new ParseError(
      `Expected type definition but found ${Token.toString(t4)}`,
      t4?.lineStart ?? t3.lineEnd,
      t4?.columnStart ?? t3.columnEnd,
      t4?.lineEnd,
      t4?.columnEnd
    );
  }

  const t5 = ctx.current;
  if (!isOperator(t5, ';')) {
    throw new ParseError(
      `Expected ";" but found ${Token.toString(t5)}`,
      t3?.lineStart ?? t2.lineEnd,
      t3?.columnStart ?? t2.columnEnd,
      t3?.lineEnd,
      t3?.columnEnd
    );
  }

  ctx.next();

  const val = new Variable(t2.value, type);
  val.setStart(t1.lineStart, t1.columnStart);
  val.setEnd(t3.lineEnd, t3.columnEnd);
  return val;
}

function readExpression(ctx: ParseContext): Expression | undefined {
  const t1 = ctx.current;
  if (!t1) {
    return;
  }

  const val = new Expression([]);
  val.setStart(t1.lineStart, t1.columnStart);
  let t: Token | undefined = t1;
  while (t && (!isOperator(t) || (t.value !== ';' && t.value !== ','))) {
    val.tokenList.push(t);
    val.setEnd(t.lineEnd, t.columnEnd);
    t = ctx.next();
  }

  return val;
}

function readExpressionStatement(ctx: ParseContext): Expression | undefined {
  const val = readExpression(ctx);
  if (!val) {
    return;
  }

  const t = ctx.current;
  if (!isOperator(t, ';')) {
    throw new ParseError(
      `Expected ";" but found ${Token.toString(t)}`,
      t?.lineStart ?? val.lineEnd,
      t?.columnStart ?? val.columnEnd,
      t?.lineEnd,
      t?.columnEnd
    );
  }

  ctx.next();

  return val;
}

function readToplevel(ctx: ParseContext): Token {
  const result = readUse(ctx) || readDef(ctx);

  if (!result) {
    const t = ctx.current!;
    throw new ParseError(`Unexpected token "${Token.toString(t)}"`, t.lineStart, t.columnStart, t.lineEnd, t.columnEnd);
  }

  return result;
}

function readStatement(ctx: ParseContext): Token {
  const result = readExpressionStatement(ctx);

  if (!result) {
    const t = ctx.current!;
    throw new ParseError(`Unexpected token "${Token.toString(t)}"`, t.lineStart, t.columnStart, t.lineEnd, t.columnEnd);
  }

  return result;
}

export function parseToplevel(tokenList: Token[]) {
  let pos = 0;

  const ctx: ParseContext = {
    current: tokenList[0],
    next: () => {
      if (!ctx.current) {
        return;
      }
      return (ctx.current = tokenList[++pos]);
    },
  };

  const outList: Token[] = [];
  while (ctx.current) {
    outList.push(readToplevel(ctx));
  }
  return outList;
}

export function parseStatements(tokenList: Token[]) {
  let pos = 0;

  const ctx: ParseContext = {
    current: tokenList[0],
    next: () => {
      if (!ctx.current) {
        return;
      }
      return (ctx.current = tokenList[++pos]);
    },
  };

  const outList: Token[] = [];
  while (ctx.current) {
    outList.push(readStatement(ctx));
  }
  return outList;
}
