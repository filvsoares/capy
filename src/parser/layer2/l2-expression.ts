import { combinePos, ERROR, Pos } from '../base';
import { L1Bracket } from '../layer1/l1-bracket';
import { L1Number } from '../layer1/l1-number';
import { L1Operator } from '../layer1/l1-operator';
import { L1Separator } from '../layer1/l1-separator';
import { L1String } from '../layer1/l1-string';
import { L1Base } from '../layer1/l1-types';
import { L1Identifier, L1Keyword } from '../layer1/l1-word';
import { Invalid, INVALID, L2Base, L2ParseContext, ReadResult } from './l2-types';

function isExpressionEnd(t: L1Base | undefined) {
  return !t || !(isOperand(t) || L1Operator.matches(t));
}

export abstract class L2Expression extends L2Base {
  isL2Expression() {
    return true;
  }

  constructor(pos: Pos) {
    super(pos);
  }
}

export abstract class L2OperationStep extends L2Base {
  constructor(pos: Pos) {
    super(pos);
  }
}

export class L2String extends L2Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `string`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}

export class L2Number extends L2Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `number`;
  }
}

export class L2Identifier extends L2Expression {
  value: string;

  constructor(value: string, pos: Pos) {
    super(pos);
    this.value = value;
  }

  toString(): string {
    return `identifier "${this.value}"`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  value: ${this.value}\n`);
  }
}

export class L2MethodCall extends L2OperationStep {
  argList: L2Expression[];

  constructor(argList: L2Expression[], pos: Pos) {
    super(pos);
    this.argList = argList;
  }

  toString(): string {
    return `call`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  argList:\n`);
    this.argList.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}

export class L2ArraySubscripting extends L2OperationStep {
  item: L2Expression;

  constructor(item: L2Expression, pos: Pos) {
    super(pos);
    this.item = item;
  }

  toString(): string {
    return 'array';
  }
}

export class L2MemberAccess extends L2OperationStep {
  member: string;

  constructor(member: string, pos: Pos) {
    super(pos);
    this.member = member;
  }

  toString(): string {
    return 'member access';
  }
}

export class L2Operation extends L2Expression {
  operand: L2Expression;
  steps: L2OperationStep[];

  constructor(operand: L2Expression, steps: L2OperationStep[], pos: Pos) {
    super(pos);
    this.operand = operand;
    this.steps = steps;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
    out.push(`${prefix}  steps:\n`);
    this.steps.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}

export class L2UnaryMinus extends L2OperationStep {
  constructor(pos: Pos) {
    super(pos);
  }

  toString(): string {
    return `operation`;
  }
}

export class L2UnaryPlus extends L2OperationStep {
  constructor(pos: Pos) {
    super(pos);
  }

  toString(): string {
    return `operation`;
  }
}

export class L2Addition extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression, pos: Pos) {
    super(pos);
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
  }
}

export class L2Subtraction extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression, pos: Pos) {
    super(pos);
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
  }
}

export class L2Multiplication extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression, pos: Pos) {
    super(pos);
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
  }
}

export class L2Division extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression, pos: Pos) {
    super(pos);
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
  }
}

export class L2Remainder extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression, pos: Pos) {
    super(pos);
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
  }
}

export class L2Assignment extends L2OperationStep {
  operand: L2Expression;

  constructor(operand: L2Expression, pos: Pos) {
    super(pos);
    this.operand = operand;
  }

  toString(): string {
    return `operation`;
  }

  debugPrint(out: string[], prefix: string): void {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  operand: `);
    this.operand.debugPrint(out, `${prefix}  `);
  }
}

function isOperand(token: L1Base | L2Expression | undefined) {
  return (
    token instanceof L2Expression ||
    token instanceof L1Identifier ||
    token instanceof L1Number ||
    token instanceof L1String ||
    (token instanceof L1Bracket && token.start === '(')
  );
}

function unwrapOperand(c: L2ParseContext, operand: L1Base | L2Expression): L2Expression | Invalid {
  if (operand instanceof L2Expression) {
    return operand;
  }
  if (operand instanceof L1Identifier) {
    return new L2Identifier(operand.name, operand.pos);
  }
  if (operand instanceof L1Number) {
    return new L2Number(operand.value, operand.pos);
  }
  if (operand instanceof L1String) {
    return new L2String(operand.value, operand.pos);
  }
  if (operand instanceof L1Bracket && operand.start === '(') {
    const c1 = new L2ParseContext(operand.tokenList);
    const r = readExpressionList(c1, {
      unexpectedTokenErrorMsg: (t) => `Expected ")" but found ${t}`,
    });
    c.errors.push(...c1.errors);
    if (r.length === 0) {
      c.errors.push({
        level: ERROR,
        message: `Expected expression`,
        pos: operand.pos,
      });
      return INVALID;
    }
    if (r.length > 1) {
      c.errors.push({
        level: ERROR,
        message: `Expected ")"`,
        pos: r[1].pos,
      });
      return INVALID;
    }
    return r[0];
  }
  c.errors.push({
    level: ERROR,
    message: `Expected expression but found ${operand}`,
    pos: operand.pos,
  });
  return INVALID;
}

function createOperation(c: L2ParseContext, t1: L1Base | L2Expression, step: L2OperationStep): L2Operation | Invalid {
  if (t1 instanceof L2Operation) {
    t1.steps.push(step);
    t1.pos = step.pos;
    return t1;
  }
  const operand = unwrapOperand(c, t1);
  if (operand === INVALID) {
    return INVALID;
  }
  return new L2Operation(operand, [step], step.pos);
}

function processOperator1(c: L2ParseContext, list: (L1Base | L2Expression)[]): (L1Base | L2Expression)[] | Invalid {
  const result: (L1Base | L2Expression)[] = [];

  let t1: L1Base | L2Expression = list[0];
  let i = 1;
  while (i < list.length) {
    const t2 = list[i];
    const t3 = list[i + 1];

    if (isOperand(t1) && L1Bracket.matches(t2, '(')) {
      const c1 = new L2ParseContext(t2.tokenList);
      const r = readExpressionList(c1, {
        unexpectedTokenErrorMsg: (t) => `Expected "," or ")" but found ${t}`,
      });
      c.errors.push(...c1.errors);
      const operation = createOperation(c, t1, new L2MethodCall(r, combinePos(t1.pos, t2.pos)));
      if (operation === INVALID) {
        return INVALID;
      }
      t1 = operation;
      i++;
      continue;
    }

    if (isOperand(t1) && L1Bracket.matches(t2, '[')) {
      const c1 = new L2ParseContext(t2.tokenList);
      const r = readExpressionList(c1, {
        unexpectedTokenErrorMsg: (t) => `Expected "]" but found ${t}`,
      });
      c.errors.push(...c1.errors);
      if (r.length === 0) {
        c.errors.push({
          level: ERROR,
          message: `Expected expression`,
          pos: t2.pos,
        });
        return INVALID;
      }
      if (r.length > 1) {
        c.errors.push({
          level: ERROR,
          message: `Expected ")"`,
          pos: r[1].pos,
        });
        return INVALID;
      }
      const operation = createOperation(c, t1, new L2ArraySubscripting(r[0], combinePos(t1.pos, t2.pos)));
      if (operation === INVALID) {
        return INVALID;
      }
      t1 = operation;
      i++;
      continue;
    }

    if (isOperand(t1) && L1Operator.matches(t2, '.') && isOperand(t3)) {
      if (!(t3 instanceof L1Keyword)) {
        c.errors.push({
          level: ERROR,
          message: `Expected identifier`,
          pos: t3.pos,
        });
        return INVALID;
      }
      const operation = createOperation(c, t1, new L2MemberAccess(t3.name, combinePos(t1.pos, t3.pos)));
      if (operation === INVALID) {
        return INVALID;
      }
      t1 = operation;
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

function processOperator2(c: L2ParseContext, list: (L1Base | L2Expression)[]): (L1Base | L2Expression)[] | Invalid {
  list = [...list].reverse();

  const result: (L1Base | L2Expression)[] = [];

  let t1: L1Base | L2Expression = list[0];
  let i = 1;
  while (i < list.length) {
    const t2 = list[i];
    const t3 = list[i + 1];

    if (isOperand(t1) && L1Operator.matches(t2, '-') && !isOperand(t3)) {
      const operation = createOperation(c, t1, new L2UnaryMinus(combinePos(t1.pos, t2.pos)));
      if (operation === INVALID) {
        return INVALID;
      }
      t1 = operation;
      i++;
      continue;
    }

    if (isOperand(t1) && L1Operator.matches(t2, '+') && !isOperand(t3)) {
      const operation = createOperation(c, t1, new L2UnaryPlus(combinePos(t1.pos, t2.pos)));
      if (operation === INVALID) {
        return INVALID;
      }
      t1 = operation;
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

function processOperator3(c: L2ParseContext, list: (L1Base | L2Expression)[]): (L1Base | L2Expression)[] | Invalid {
  const result: (L1Base | L2Expression)[] = [];

  let t1: L1Base | L2Expression = list[0];
  let i = 1;
  while (i < list.length) {
    const t2 = list[i];
    const t3 = list[i + 1];

    if (isOperand(t1) && L1Operator.matches(t2, '*') && isOperand(t3)) {
      const operand = unwrapOperand(c, t3);
      if (operand === INVALID) {
        return INVALID;
      }
      const operation = createOperation(c, t1, new L2Multiplication(operand, combinePos(t1.pos, t3.pos)));
      if (operation === INVALID) {
        return INVALID;
      }
      t1 = operation;
      i += 2;
      continue;
    }

    if (isOperand(t1) && L1Operator.matches(t2, '/') && isOperand(t3)) {
      const operand = unwrapOperand(c, t3);
      if (operand === INVALID) {
        return INVALID;
      }
      const operation = createOperation(c, t1, new L2Division(operand, combinePos(t1.pos, t3.pos)));
      if (operation === INVALID) {
        return INVALID;
      }
      t1 = operation;
      i += 2;
      continue;
    }

    if (isOperand(t1) && L1Operator.matches(t2, '%') && isOperand(t3)) {
      const operand = unwrapOperand(c, t3);
      if (operand === INVALID) {
        return INVALID;
      }
      const operation = createOperation(c, t1, new L2Remainder(operand, combinePos(t1.pos, t3.pos)));
      if (operation === INVALID) {
        return INVALID;
      }
      t1 = operation;
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

function processOperator4(c: L2ParseContext, list: (L1Base | L2Expression)[]): (L1Base | L2Expression)[] | Invalid {
  const result: (L1Base | L2Expression)[] = [];

  let t1: L1Base | L2Expression = list[0];
  let i = 1;
  while (i < list.length) {
    const t2 = list[i];
    const t3 = list[i + 1];

    if (isOperand(t1) && L1Operator.matches(t2, '+') && isOperand(t3)) {
      const operand = unwrapOperand(c, t3);
      if (operand === INVALID) {
        return INVALID;
      }
      const operation = createOperation(c, t1, new L2Addition(operand, combinePos(t1.pos, t3.pos)));
      if (operation === INVALID) {
        return INVALID;
      }
      t1 = operation;
      i += 2;
      continue;
    }

    if (isOperand(t1) && L1Operator.matches(t2, '-') && isOperand(t3)) {
      const operand = unwrapOperand(c, t3);
      if (operand === INVALID) {
        return INVALID;
      }
      const operation = createOperation(c, t1, new L2Subtraction(operand, combinePos(t1.pos, t3.pos)));
      if (operation === INVALID) {
        return INVALID;
      }
      t1 = operation;
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

function processOperator5(c: L2ParseContext, list: (L1Base | L2Expression)[]): (L1Base | L2Expression)[] | Invalid {
  list = [...list].reverse();

  const result: (L1Base | L2Expression)[] = [];

  let t1: L1Base | L2Expression = list[0];
  let i = 1;
  while (i < list.length) {
    const t2 = list[i];
    const t3 = list[i + 1];

    if (isOperand(t1) && L1Operator.matches(t2, '=') && isOperand(t3)) {
      const operand = unwrapOperand(c, t3);
      if (operand === INVALID) {
        return INVALID;
      }
      const operation = createOperation(c, t1, new L2Assignment(operand, combinePos(t1.pos, t3.pos)));
      if (operation === INVALID) {
        return INVALID;
      }
      t1 = operation;
      i += 2;
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

export type ReadExpressionOpts = {
  unexpectedTokenErrorMsg?: (t: L1Base | L2Expression) => string;
};

export function readExpression(
  c: L2ParseContext,
  { unexpectedTokenErrorMsg }: ReadExpressionOpts = {}
): ReadResult<L2Expression> {
  let list: (L1Base | L2Expression)[] = [];

  while (true) {
    const t = c.current;
    if (isExpressionEnd(t)) {
      break;
    }
    list.push(t!);
    c.consume();
  }

  if (list.length === 0) {
    return;
  }

  const p1 = processOperator1(c, list);
  if (p1 === INVALID) {
    return INVALID;
  }
  const p2 = processOperator2(c, p1);
  if (p2 === INVALID) {
    return INVALID;
  }
  const p3 = processOperator3(c, p2);
  if (p3 === INVALID) {
    return INVALID;
  }
  const p4 = processOperator4(c, p3);
  if (p4 === INVALID) {
    return INVALID;
  }
  const p5 = processOperator5(c, p4);
  if (p5 === INVALID) {
    return INVALID;
  }

  if (p5.length > 1) {
    console.log(p5);
    c.errors.push({
      level: ERROR,
      message: unexpectedTokenErrorMsg?.(p5[1]) ?? `Unexpected ${p5[1]}`,
      pos: p5[1].pos,
    });
    return INVALID;
  }

  return unwrapOperand(c, p5[0]);
}

function readExpressionList(c: L2ParseContext, opts: ReadExpressionOpts = {}): L2Expression[] {
  const outList: L2Expression[] = [];
  let error = false;
  while (c.current) {
    const val = readExpression(c, opts);
    if (val === INVALID) {
      error = true;
      continue;
    }
    if (!val) {
      if (!error) {
        error = true;
        const t = c.current!;
        c.errors.push({
          level: ERROR,
          message: `Unexpected ${t}`,
          pos: {
            lin1: t.pos.lin1,
            col1: t.pos.col1,
            lin2: t.pos.lin2,
            col2: t.pos.col2,
          },
        });
      }
      c.consume();
      continue;
    }

    outList.push(val);
    error = false;

    const t1 = c.current;
    if (!t1) {
      break;
    }
    if (!L1Separator.matches(t1, ',')) {
      c.errors.push({
        level: ERROR,
        message: `Expected ","`,
        pos: {
          lin1: t1.pos.lin1,
          col1: t1.pos.col1,
          lin2: t1.pos.lin2,
          col2: t1.pos.col2,
        },
      });
      c.consume();
      continue;
    }
    c.consume();

    const t2 = c.current;
    if (!t2) {
      c.errors.push({
        level: ERROR,
        message: `Expected expression after ","`,
        pos: {
          lin1: t1.pos.lin2,
          col1: t1.pos.col2,
          lin2: t1.pos.lin2,
          col2: t1.pos.col2,
        },
      });
    }
  }
  return outList;
}
