import {
  ArraySubscripting,
  Bracket,
  MemberAccess,
  Method,
  MethodCall,
  Operator,
  ParseError,
  String,
  Token,
  Type,
  Use,
  Variable,
  Word,
} from './token';

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
  return !!token && token instanceof Bracket && (value === undefined || token.start === value);
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

function processOperator1(list: Token[]): Token[] {
  const result: Token[] = [];

  let t1: Token = list[0];
  let i = 1;
  while (i < list.length) {
    const t2 = list[i];
    const t3 = list[i + 1];

    if (isOperand(t1) && isBracket(t2, '(')) {
      t1 = new MethodCall(unwrapOperand(t1), parseExpressionList(t2.tokenList));
      i++;
      continue;
    }

    if (isOperand(t1) && isBracket(t2, '[')) {
      const value = parseExpressionList(t2.tokenList);
      if (value.length !== 1) {
        throw new ParseError(`Only 1 expression accepted`, t2.lineStart, t2.columnStart);
      }
      t1 = new ArraySubscripting(unwrapOperand(t1), value[0]);
      i++;
      continue;
    }

    if (isOperand(t1) && isOperator(t2, '.') && isOperand(t3)) {
      t1 = new MemberAccess(unwrapOperand(t1), unwrapOperand(t3));
      i += 2;
      continue;
    }

    result.push(t1);
    t1 = t2;
    i++;
  }
  result.push(t1);
  return result;
}

function isOperand(token: Token) {
  return token.isExpression() || isBracket(token, '(');
}

function unwrapOperand(token: Token): Token {
  if (!isBracket(token, '(')) {
    return token;
  }
  const subexprs = parseExpressionList(token.tokenList);
  if (subexprs.length !== 1) {
    throw new ParseError(`Expected 1 expression here`, token.lineStart, token.columnStart);
  }
  return subexprs[0];
}

function readExpression(ctx: ParseContext): Token | undefined {
  const t1 = ctx.current;
  if (!t1) {
    return;
  }

  let list: Token[] = [];

  let t: Token | undefined = t1;
  while (t) {
    if (isOperator(t) && (t.value === ';' || t.value === ',')) {
      break;
    }
    list.push(t);
    t = ctx.next();
  }

  list = processOperator1(list);

  if (list.length > 1) {
    throw new ParseError(`Unexpected ${list[1].toString()}`, list[1].lineStart, list[1].columnStart);
  }

  return unwrapOperand(list[0]);
}

function readExpressionStatement(ctx: ParseContext): Token | undefined {
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

function readToplevel(ctx: ParseContext): Token | undefined {
  return readUse(ctx) || readDef(ctx);
}

function readStatement(ctx: ParseContext): Token | undefined {
  return readExpressionStatement(ctx);
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
    const val = readToplevel(ctx);

    if (!val) {
      const t = ctx.current!;
      throw new ParseError(
        `Unexpected token "${Token.toString(t)}"`,
        t.lineStart,
        t.columnStart,
        t.lineEnd,
        t.columnEnd
      );
    }

    outList.push(val);
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
    const val = readStatement(ctx);
    if (!val) {
      const t = ctx.current!;
      throw new ParseError(
        `Unexpected token "${Token.toString(t)}"`,
        t.lineStart,
        t.columnStart,
        t.lineEnd,
        t.columnEnd
      );
    }
    outList.push(val);
  }
  return outList;
}

export function parseExpressionList(tokenList: Token[]) {
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
    const val = readExpression(ctx);
    if (!val) {
      throw new ParseError(`Unexpected ${Token.toString(ctx.current)}`, ctx.current.lineStart, ctx.current.lineEnd);
    }
    outList.push(val);
    if (!ctx.current) {
      break;
    }
    const t = ctx.current;
    if (!isOperator(t, ',')) {
      throw new ParseError(
        `Expected "," but found ${Token.toString(t)}`,
        t?.lineStart ?? val.lineEnd,
        t?.columnStart ?? val.columnEnd,
        t?.lineEnd,
        t?.columnEnd
      );
    }
    ctx.next();
    if (!ctx.current) {
      throw new ParseError(`Expected expression after ","`, t.lineStart, t.lineEnd);
    }
  }
  return outList;
}
