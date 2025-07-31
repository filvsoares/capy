import {
  BRACKET,
  Bracket,
  Operator,
  OPERATOR,
  ParseError,
  String,
  STRING,
  Token,
  tokenToString,
  Word,
  WORD,
} from './text-parser';

type ParseContext = {
  current: Token | undefined;
  next: () => Token | undefined;
};

function isWord(token: Token | undefined, value?: string): token is Word {
  return !!token && token.type === WORD && (value === undefined || token.value === value);
}

function isString(token: Token | undefined, value?: string): token is String {
  return !!token && token.type === STRING && (value === undefined || token.value === value);
}

function isOperator(token: Token | undefined, value?: string): token is Operator {
  return !!token && token.type === OPERATOR && (value === undefined || token.value === value);
}

function isBracket(token: Token | undefined, value?: string): token is Bracket {
  return !!token && token.type === BRACKET && (value === undefined || token.value === value);
}

type BaseToplevel = {
  type: number;
  lineStart: number;
  columnStart: number;
  lineEnd: number;
  columnEnd: number;
};

export const USE = 1;
export const METHOD = 2;
export const VARIABLE = 3;
export const TYPE = 4;

export type Use = BaseToplevel & {
  type: typeof USE;
  value: string;
};

export type Method = BaseToplevel & {
  type: typeof METHOD;
  name: string;
  returnType?: Type;
};

export type Variable = BaseToplevel & {
  type: typeof VARIABLE;
  name: string;
  varType: Type;
};

export type Type = BaseToplevel & {
  type: typeof TYPE;
  value: string;
};

export type Toplevel = Use | Method | Variable | Type;

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

  return {
    type: USE,
    lineStart: t1.lineStart,
    columnStart: t1.columnStart,
    lineEnd: t3.lineEnd,
    columnEnd: t3.columnEnd,
    value: t2.value,
  };
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
    `Expected "(" or ":" but found ${tokenToString(t3)}`,
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
        `Expected return type but found ${tokenToString(t4)}`,
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
      `Expected "{" but found ${tokenToString(t4)}`,
      t4?.lineStart ?? t3.lineEnd,
      t4?.columnStart ?? t3.columnEnd,
      t4?.lineEnd,
      t4?.columnEnd
    );
  }

  ctx.next();

  return {
    type: METHOD,
    lineStart: t1.lineStart,
    columnStart: t1.columnStart,
    lineEnd: t3.lineEnd,
    columnEnd: t3.columnEnd,
    value: t2.value,
    returnType,
  };
}

function readType(ctx: ParseContext): Type | undefined {
  const t1 = ctx.current;
  if (!isWord(t1)) {
    return undefined;
  }

  ctx.next();

  return {
    type: TYPE,
    lineStart: t1.lineStart,
    columnStart: t1.columnStart,
    lineEnd: t1.lineEnd,
    columnEnd: t1.columnEnd,
    value: t1.value,
  };
}

function readDefVariable(t1: Word, t2: Word, t3: Operator, ctx: ParseContext): Variable | undefined {
  const t4 = ctx.next();
  const type = readType(ctx);
  if (!type) {
    throw new ParseError(
      `Expected type definition but found ${tokenToString(t4)}`,
      t4?.lineStart ?? t3.lineEnd,
      t4?.columnStart ?? t3.columnEnd,
      t4?.lineEnd,
      t4?.columnEnd
    );
  }

  const t5 = ctx.current;
  if (!isOperator(t5, ';')) {
    throw new ParseError(
      `Expected ";" but found ${tokenToString(t5)}`,
      t3?.lineStart ?? t2.lineEnd,
      t3?.columnStart ?? t2.columnEnd,
      t3?.lineEnd,
      t3?.columnEnd
    );
  }

  ctx.next();

  return {
    type: VARIABLE,
    lineStart: t1.lineStart,
    columnStart: t1.columnStart,
    lineEnd: t3.lineEnd,
    columnEnd: t3.columnEnd,
    name: t2.value,
    varType: type,
  };
}

function readSomething(ctx: ParseContext): Toplevel {
  const result = readUse(ctx) || readDef(ctx);

  const t = ctx.current!;
  if (!result) {
    throw new ParseError(`Unexpected token "${tokenToString(t)}"`, t.lineStart, t.columnStart, t.lineEnd, t.columnEnd);
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

  const toplevelList: Toplevel[] = [];
  while (ctx.current) {
    toplevelList.push(readSomething(ctx));
  }
  return toplevelList;
}
