import { Base, ParseError } from './base';
import { L1Bracket, L1Operator, L1String, L1Base, L1Word, L1Number } from './l1-types';
import {
  L2Addition,
  L2ArraySubscripting,
  L2Base,
  L2Division,
  L2Identifier,
  L2MemberAccess,
  L2Method,
  L2MethodCall,
  L2Multiplication,
  L2Number,
  L2Operation,
  L2OperationStep,
  L2Remainder,
  L2String,
  L2Subtraction,
  L2Type,
  L2UnaryMinus,
  L2UnaryPlus,
  L2Use,
  L2Variable,
} from './l2-types';

type ParseContext = {
  current: L1Base | undefined;
  next: () => L1Base | undefined;
};

function isWord(token: any, value?: string): token is L1Word {
  return token instanceof L1Word && (value === undefined || token.value === value);
}

function isString(token: any, value?: string): token is L1String {
  return token instanceof L1String && (value === undefined || token.value === value);
}

function isOperator(token: any, value?: string): token is L1Operator {
  return token instanceof L1Operator && (value === undefined || token.value === value);
}

function isBracket(token: any, value?: string): token is L1Bracket {
  return token instanceof L1Bracket && (value === undefined || token.start === value);
}

function readUse(ctx: ParseContext): L2Use | undefined {
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

  const val = new L2Use(t2.value);
  val.setStart(t1.lineStart, t1.columnStart);
  val.setEnd(t3.lineEnd, t3.columnEnd);
  return val;
}

function readDef(ctx: ParseContext): L2Method | L2Variable | undefined {
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
    `Expected "(" or ":" but found ${Base.toString(t3)}`,
    t3?.lineStart ?? t2.lineEnd,
    t3?.columnStart ?? t2.columnEnd,
    t3?.lineEnd,
    t3?.columnEnd
  );
}

function readDefMethod(t1: L1Word, t2: L1Word, t3: L1Bracket, ctx: ParseContext): L2Method | undefined {
  let returnType: L2Type | undefined;

  let t4 = ctx.next();

  if (isOperator(t4, ':')) {
    ctx.next();
    returnType = readType(ctx);
    if (!returnType) {
      throw new ParseError(
        `Expected return type but found ${Base.toString(t4)}`,
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
      `Expected "{" but found ${Base.toString(t4)}`,
      t4?.lineStart ?? t3.lineEnd,
      t4?.columnStart ?? t3.columnEnd,
      t4?.lineEnd,
      t4?.columnEnd
    );
  }

  ctx.next();

  const val = new L2Method(t2.value, returnType, parseStatements(t4.tokenList));
  val.setStart(t1.lineStart, t1.columnStart);
  val.setEnd(t3.lineEnd, t3.columnEnd);
  return val;
}

function readType(ctx: ParseContext): L2Type | undefined {
  const t1 = ctx.current;
  if (!isWord(t1)) {
    return undefined;
  }

  ctx.next();

  const val = new L2Type(t1.value);
  val.setStart(t1.lineStart, t1.columnStart);
  val.setEnd(t1.lineEnd, t1.columnEnd);
  return val;
}

function readDefVariable(t1: L1Word, t2: L1Word, t3: L1Operator, ctx: ParseContext): L2Variable | undefined {
  const t4 = ctx.next();
  const type = readType(ctx);
  if (!type) {
    throw new ParseError(
      `Expected type definition but found ${Base.toString(t4)}`,
      t4?.lineStart ?? t3.lineEnd,
      t4?.columnStart ?? t3.columnEnd,
      t4?.lineEnd,
      t4?.columnEnd
    );
  }

  const t5 = ctx.current;
  if (!isOperator(t5, ';')) {
    throw new ParseError(
      `Expected ";" but found ${Base.toString(t5)}`,
      t3?.lineStart ?? t2.lineEnd,
      t3?.columnStart ?? t2.columnEnd,
      t3?.lineEnd,
      t3?.columnEnd
    );
  }

  ctx.next();

  const val = new L2Variable(t2.value, type);
  val.setStart(t1.lineStart, t1.columnStart);
  val.setEnd(t3.lineEnd, t3.columnEnd);
  return val;
}

function isOperand(token: L1Base | L2Base | undefined) {
  return (
    token instanceof L2Base ||
    token instanceof L1Word ||
    token instanceof L1Number ||
    token instanceof L1String ||
    (token instanceof L1Bracket && token.start === '(')
  );
}

function unwrapOperand(token: L1Base | L2Base): L2Base {
  if (token instanceof L2Base) {
    return token;
  }
  if (token instanceof L1Word) {
    return new L2Identifier(token.value);
  }
  if (token instanceof L1Number) {
    return new L2Number(token.value);
  }
  if (token instanceof L1String) {
    return new L2String(token.value);
  }
  if (token instanceof L1Bracket && token.start === '(') {
    const subexprs = parseExpressionList(token.tokenList);
    if (subexprs.length !== 1) {
      throw new ParseError(`Expected 1 expression here`, token.lineStart, token.columnStart);
    }
    return subexprs[0];
  }
  throw new Error(`Unexpected ${Base.toString(token)}`);
}

function createOperation(t1: L1Base | L2Base, step: L2OperationStep) {
  if (t1 instanceof L2Operation) {
    t1.steps.push(step);
    return t1;
  }
  const op = new L2Operation(unwrapOperand(t1), [step]);
  return op;
}

function processOperator1(list: (L1Base | L2Base)[]) {
  const result: (L1Base | L2Base)[] = [];

  let t1: L1Base | L2Base = list[0];
  let i = 1;
  while (i < list.length) {
    const t2 = list[i];
    const t3 = list[i + 1];

    if (isOperand(t1) && isBracket(t2, '(')) {
      t1 = createOperation(t1, new L2MethodCall(parseExpressionList(t2.tokenList)));
      i++;
      continue;
    }

    if (isOperand(t1) && isBracket(t2, '[')) {
      const value = parseExpressionList(t2.tokenList);
      if (value.length !== 1) {
        throw new ParseError(`Only 1 expression accepted`, t2.lineStart, t2.columnStart);
      }
      t1 = createOperation(t1, new L2ArraySubscripting(value[0]));
      i++;
      continue;
    }

    if (isOperand(t1) && isOperator(t2, '.') && isOperand(t3)) {
      if (!(t3 instanceof L1Word)) {
        throw new ParseError(`Expected identifier but found ${Base.toString(t3)}`, t3.lineStart, t3.columnStart);
      }
      t1 = createOperation(t1, new L2MemberAccess(t3.value));
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

function processOperator2(list: (L1Base | L2Base)[]) {
  list = [...list].reverse();

  const result: (L1Base | L2Base)[] = [];

  let t1: L1Base | L2Base = list[0];
  let i = 1;
  while (i < list.length) {
    const t2 = list[i];
    const t3 = list[i + 1];

    if (isOperand(t1) && isOperator(t2, '-') && !isOperand(t3)) {
      t1 = createOperation(t1, new L2UnaryMinus());
      i++;
      continue;
    }

    if (isOperand(t1) && isOperator(t2, '+') && !isOperand(t3)) {
      t1 = createOperation(t1, new L2UnaryPlus());
      i++;
      continue;
    }

    result.push(t1);
    t1 = t2;
    i++;
  }
  result.push(t1);
  result.reverse();
  return result;
}

function processOperator3(list: (L1Base | L2Base)[]) {
  const result: (L1Base | L2Base)[] = [];

  let t1: L1Base | L2Base = list[0];
  let i = 1;
  while (i < list.length) {
    const t2 = list[i];
    const t3 = list[i + 1];

    if (isOperand(t1) && isOperator(t2, '*') && isOperand(t3)) {
      t1 = createOperation(t1, new L2Multiplication(unwrapOperand(t3)));
      i += 2;
      continue;
    }

    if (isOperand(t1) && isOperator(t2, '/') && isOperand(t3)) {
      t1 = createOperation(t1, new L2Division(unwrapOperand(t3)));
      i += 2;
      continue;
    }

    if (isOperand(t1) && isOperator(t2, '%') && isOperand(t3)) {
      t1 = createOperation(t1, new L2Remainder(unwrapOperand(t3)));
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

function processOperator4(list: (L1Base | L2Base)[]) {
  const result: (L1Base | L2Base)[] = [];

  let t1: L1Base | L2Base = list[0];
  let i = 1;
  while (i < list.length) {
    const t2 = list[i];
    const t3 = list[i + 1];

    if (isOperand(t1) && isOperator(t2, '+') && isOperand(t3)) {
      t1 = createOperation(t1, new L2Addition(unwrapOperand(t3)));
      i += 2;
      continue;
    }

    if (isOperand(t1) && isOperator(t2, '-') && isOperand(t3)) {
      t1 = createOperation(t1, new L2Subtraction(unwrapOperand(t3)));
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

function readExpression(ctx: ParseContext): L2Base | undefined {
  const t1 = ctx.current;
  if (!t1) {
    return;
  }

  let list: (L1Base | L2Base)[] = [];

  let t: L1Base | undefined = t1;
  while (t) {
    if (isOperator(t) && (t.value === ';' || t.value === ',')) {
      break;
    }
    list.push(t);
    t = ctx.next();
  }

  list = processOperator1(list);
  list = processOperator2(list);
  list = processOperator3(list);
  list = processOperator4(list);

  if (list.length > 1) {
    throw new ParseError(`Unexpected ${list[1].toString()}`, list[1].lineStart, list[1].columnStart);
  }

  return unwrapOperand(list[0]);
}

function readExpressionStatement(ctx: ParseContext): L2Base | undefined {
  const val = readExpression(ctx);
  if (!val) {
    return;
  }

  const t = ctx.current;
  if (!isOperator(t, ';')) {
    throw new ParseError(
      `Expected ";" but found ${Base.toString(t)}`,
      t?.lineStart ?? val.lineEnd,
      t?.columnStart ?? val.columnEnd,
      t?.lineEnd,
      t?.columnEnd
    );
  }

  ctx.next();

  return val;
}

function readToplevel(ctx: ParseContext): L2Base | undefined {
  return readUse(ctx) || readDef(ctx);
}

function readStatement(ctx: ParseContext): L2Base | undefined {
  return readExpressionStatement(ctx);
}

export function parseToplevel(tokenList: L1Base[]) {
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

  const outList: L2Base[] = [];
  while (ctx.current) {
    const val = readToplevel(ctx);

    if (!val) {
      const t = ctx.current!;
      throw new ParseError(
        `Unexpected token "${Base.toString(t)}"`,
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

export function parseStatements(tokenList: L1Base[]) {
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

  const outList: L2Base[] = [];
  while (ctx.current) {
    const val = readStatement(ctx);
    if (!val) {
      const t = ctx.current!;
      throw new ParseError(
        `Unexpected token "${Base.toString(t)}"`,
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

export function parseExpressionList(tokenList: L1Base[]) {
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

  const outList: L2Base[] = [];
  while (ctx.current) {
    const val = readExpression(ctx);
    if (!val) {
      throw new ParseError(`Unexpected ${Base.toString(ctx.current)}`, ctx.current.lineStart, ctx.current.lineEnd);
    }
    outList.push(val);
    if (!ctx.current) {
      break;
    }
    const t = ctx.current;
    if (!isOperator(t, ',')) {
      throw new ParseError(
        `Expected "," but found ${Base.toString(t)}`,
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
