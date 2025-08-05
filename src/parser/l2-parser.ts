/**
 * Capy project.
 * Copyright (c) 2025 - Filipe Vilela Soares
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @file Layer-2 parser implementation.
 */

import { Base, ERROR, ParseError, ParseError1, WithPos } from './base';
import { L1Bracket, L1Operator, L1String, L1Base, L1Word, L1Number, L1BasePos } from './l1-types';
import {
  L2Addition,
  L2ArraySubscripting,
  L2Base,
  L2Division,
  L2Expression,
  L2Identifier,
  L2MemberAccess,
  L2Method,
  L2MethodCall,
  L2Multiplication,
  L2Number,
  L2Operation,
  L2OperationStep,
  L2ParseExpressionListResult,
  L2ParseToplevelResult as L2ParseResult,
  L2Remainder,
  L2String,
  L2Subtraction,
  L2Type,
  L2UnaryMinus,
  L2UnaryPlus,
  L2Use,
  L2Variable,
} from './l2-types';
import { L3Type } from './l3-types';

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

function isOperand(token: L1Base | L2Expression | undefined) {
  return (
    token instanceof L2Expression ||
    token instanceof L1Word ||
    token instanceof L1Number ||
    token instanceof L1String ||
    (token instanceof L1Bracket && token.start === '(')
  );
}

function isExpressionEnd(t: L1BasePos | undefined) {
  return !t || (isOperator(t) && (t.value === ';' || t.value === ','));
}

function makePos(t: WithPos | undefined, tBefore: WithPos) {
  return {
    lin1: t?.pos.lin1 ?? tBefore.pos.lin2,
    col1: t?.pos.col1 ?? tBefore.pos.col2,
    lin2: t?.pos.lin2 ?? tBefore.pos.lin2,
    col2: t?.pos.col2 ?? tBefore.pos.col2,
  };
}

const INVALID = 1;
type Invalid = typeof INVALID;
type ReadResult<T> = T | Invalid | undefined;

class L2Parser {
  pos: number = 0;
  list: L1BasePos[] = [];
  current: L1BasePos | undefined;
  errors: ParseError1[] = [];

  next() {
    if (!this.current) {
      return;
    }
    return (this.current = this.list[++this.pos]);
  }

  readUse(): ReadResult<L2Use> {
    const t1 = this.current;
    if (!isWord(t1, 'use')) {
      return;
    }

    const t2 = this.next();
    if (!isString(t2)) {
      this.errors.push({
        level: ERROR,
        message: `Expected string`,
        pos: makePos(t2, t1),
      });
      return INVALID;
    }

    const t3 = this.next();
    if (!isOperator(t3, ';')) {
      this.errors.push({
        level: ERROR,
        message: `Expected ";"`,
        pos: makePos(t3, t2),
      });
      return INVALID;
    }

    this.next();

    return new L2Use(t2.value);
  }

  readDef(): ReadResult<L2Method | L2Variable> {
    const t1 = this.current;
    if (!isWord(t1, 'def')) {
      return;
    }

    const t2 = this.next();

    if (!isWord(t2)) {
      this.errors.push({
        level: ERROR,
        message: `Expected string`,
        pos: makePos(t2, t1),
      });
      return INVALID;
    }

    const t3 = this.next();
    if (isBracket(t3, '(')) {
      return this.readDefMethod(t1, t2, t3);
    }
    if (isOperator(t3, ':')) {
      return this.readDefVariable(t1, t2, t3);
    }

    this.errors.push({
      level: ERROR,
      message: `Expected "(" or ":"`,
      pos: makePos(t3, t2),
    });
    return INVALID;
  }

  readDefMethod(t1: L1Word, t2: L1Word, t3: L1Bracket): ReadResult<L2Method> {
    let returnType: L2Type | undefined;

    let t4 = this.next();
    let t5 = t4;
    let t6 = t4;

    if (isOperator(t4, ':')) {
      t5 = this.next();
      const _returnType = t5 && this.readType();
      if (_returnType === INVALID) {
        return INVALID;
      }
      if (!_returnType) {
        this.errors.push({
          level: ERROR,
          message: `Expected return type`,
          pos: makePos(t5, t4),
        });
        return INVALID;
      }
      returnType = _returnType;
      t6 = this.current;
    }

    if (!isBracket(t6, '{')) {
      this.errors.push({
        level: ERROR,
        message: `Expected "{"`,
        pos: makePos(t6, t5!),
      });
      return INVALID;
    }

    this.next();

    const r = new L2Parser().parseStatements(t6.tokenList);
    if (r.errors.length > 0) {
      this.errors.push(...r.errors);
      return INVALID;
    }

    return new L2Method(t2.value, returnType, r.list);
  }

  readType(): ReadResult<L2Type> {
    const t1 = this.current;
    if (!isWord(t1)) {
      return;
    }

    this.next();

    return new L2Type(t1.value);
  }

  readDefVariable(t1: L1Word, t2: L1Word, t3: L1Operator): ReadResult<L2Variable> {
    const t4 = this.next();
    const type = t4 && this.readType();
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      this.errors.push({
        level: ERROR,
        message: `Expected type`,
        pos: makePos(t4, t3),
      });
      return INVALID;
    }

    const t5 = this.current;
    if (!isOperator(t5, ';')) {
      this.errors.push({
        level: ERROR,
        message: `Expected ";"`,
        pos: makePos(t5, t4),
      });
      return INVALID;
    }

    this.next();

    return new L2Variable(t2.value, type);
  }

  readToplevel(): ReadResult<L2Base> {
    return this.readUse() || this.readDef();
  }

  unwrapOperand(operand: L1BasePos | L2Expression): L2Expression | Invalid {
    if (operand instanceof L2Expression) {
      return operand;
    }
    if (operand instanceof L1Word) {
      return new L2Identifier(operand.value, operand.pos);
    }
    if (operand instanceof L1Number) {
      return new L2Number(operand.value, operand.pos);
    }
    if (operand instanceof L1String) {
      return new L2String(operand.value, operand.pos);
    }
    if (operand instanceof L1Bracket && operand.start === '(') {
      const r = new L2Parser().parseExpressionList(operand.tokenList);
      if (r.errors.length > 0) {
        this.errors.push(...r.errors);
        return INVALID;
      }
      if (r.list.length === 0) {
        this.errors.push({
          level: ERROR,
          message: `Expected expression`,
          pos: operand.pos,
        });
        return INVALID;
      }
      if (r.list.length > 1) {
        this.errors.push({
          level: ERROR,
          message: `Expected ")"`,
          pos: r.list[1].pos,
        });
        return INVALID;
      }
      return r.list[0];
    }
    this.errors.push({
      level: ERROR,
      message: `Expected expression`,
      pos: operand.pos,
    });
    return INVALID;
  }

  createOperation(t1: L1BasePos | L2Expression, step: L2OperationStep): L2Operation | Invalid {
    if (t1 instanceof L2Operation) {
      t1.steps.push(step);
      return t1;
    }
    const operand = this.unwrapOperand(t1);
    if (operand === INVALID) {
      return INVALID;
    }
    return new L2Operation(operand, [step], operand.pos);
  }

  processOperator1(list: (L1BasePos | L2Expression)[]): (L1BasePos | L2Expression)[] | Invalid {
    const result: (L1BasePos | L2Expression)[] = [];

    let t1: L1BasePos | L2Expression = list[0];
    let i = 1;
    while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      if (isOperand(t1) && isBracket(t2, '(')) {
        const r = new L2Parser().parseExpressionList(t2.tokenList);
        if (r.errors.length > 0) {
          this.errors.push(...r.errors);
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2MethodCall(r.list));
        if (operation === INVALID) {
          return INVALID;
        }
        t1 = operation;
        i++;
        continue;
      }

      if (isOperand(t1) && isBracket(t2, '[')) {
        const r = new L2Parser().parseExpressionList(t2.tokenList);
        if (r.errors.length > 0) {
          this.errors.push(...r.errors);
          return INVALID;
        }
        if (r.list.length === 0) {
          this.errors.push({
            level: ERROR,
            message: `Expected expression`,
            pos: t2.pos,
          });
          return INVALID;
        }
        if (r.list.length > 1) {
          this.errors.push({
            level: ERROR,
            message: `Expected ")"`,
            pos: r.list[1].pos,
          });
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2ArraySubscripting(r.list[0]));
        if (operation === INVALID) {
          return INVALID;
        }
        t1 = operation;
        i++;
        continue;
      }

      if (isOperand(t1) && isOperator(t2, '.') && isOperand(t3)) {
        if (!(t3 instanceof L1Word)) {
          this.errors.push({
            level: ERROR,
            message: `Expected identifier`,
            pos: t3.pos,
          });
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2MemberAccess(t3.value));
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

  processOperator2(list: (L1BasePos | L2Expression)[]): (L1BasePos | L2Expression)[] | Invalid {
    list = [...list].reverse();

    const result: (L1BasePos | L2Expression)[] = [];

    let t1: L1BasePos | L2Expression = list[0];
    let i = 1;
    while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      if (isOperand(t1) && isOperator(t2, '-') && !isOperand(t3)) {
        const operation = this.createOperation(t1, new L2UnaryMinus());
        if (operation === INVALID) {
          return INVALID;
        }
        t1 = operation;
        i++;
        continue;
      }

      if (isOperand(t1) && isOperator(t2, '+') && !isOperand(t3)) {
        const operation = this.createOperation(t1, new L2UnaryPlus());
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

  processOperator3(list: (L1BasePos | L2Expression)[]): (L1BasePos | L2Expression)[] | Invalid {
    const result: (L1BasePos | L2Expression)[] = [];

    let t1: L1BasePos | L2Expression = list[0];
    let i = 1;
    while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      if (isOperand(t1) && isOperator(t2, '*') && isOperand(t3)) {
        const operand = this.unwrapOperand(t3);
        if (operand === INVALID) {
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2Multiplication(operand));
        if (operation === INVALID) {
          return INVALID;
        }
        t1 = operation;
        i += 2;
        continue;
      }

      if (isOperand(t1) && isOperator(t2, '/') && isOperand(t3)) {
        const operand = this.unwrapOperand(t3);
        if (operand === INVALID) {
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2Division(operand));
        if (operation === INVALID) {
          return INVALID;
        }
        t1 = operation;
        i += 2;
        continue;
      }

      if (isOperand(t1) && isOperator(t2, '%') && isOperand(t3)) {
        const operand = this.unwrapOperand(t3);
        if (operand === INVALID) {
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2Remainder(operand));
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

  processOperator4(list: (L1BasePos | L2Expression)[]): (L1BasePos | L2Expression)[] | Invalid {
    const result: (L1BasePos | L2Expression)[] = [];

    let t1: L1BasePos | L2Expression = list[0];
    let i = 1;
    while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      if (isOperand(t1) && isOperator(t2, '+') && isOperand(t3)) {
        const operand = this.unwrapOperand(t3);
        if (operand === INVALID) {
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2Addition(operand));
        if (operation === INVALID) {
          return INVALID;
        }
        t1 = operation;
        i += 2;
        continue;
      }

      if (isOperand(t1) && isOperator(t2, '-') && isOperand(t3)) {
        const operand = this.unwrapOperand(t3);
        if (operand === INVALID) {
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2Subtraction(operand));
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

  readExpression(): ReadResult<L2Expression> {
    const t1 = this.current;
    if (isExpressionEnd(t1)) {
      return;
    }

    let list: (L1BasePos | L2Expression)[] = [];

    let t: L1BasePos | undefined = t1;
    do {
      list.push(t!);
      t = this.next();
    } while (!isExpressionEnd(t));

    const p1 = this.processOperator1(list);
    if (p1 === INVALID) {
      return INVALID;
    }
    const p2 = this.processOperator2(p1);
    if (p2 === INVALID) {
      return INVALID;
    }
    const p3 = this.processOperator3(p2);
    if (p3 === INVALID) {
      return INVALID;
    }
    const p4 = this.processOperator4(p3);
    if (p4 === INVALID) {
      return INVALID;
    }

    if (p4.length > 1) {
      this.errors.push({
        level: ERROR,
        message: `Unexpected token2`,
        pos: p4[1].pos,
      });
      return INVALID;
    }

    return this.unwrapOperand(p4[0]);
  }

  readExpressionStatement(): ReadResult<L2Base> {
    const val = this.readExpression();
    if (val === INVALID) {
      return INVALID;
    }
    if (!val) {
      return;
    }

    const t = this.current;
    if (!isOperator(t, ';')) {
      this.errors.push({
        level: ERROR,
        message: `Expected ";"`,
        pos: makePos(t, val),
      });
      return INVALID;
    }

    this.next();

    return val;
  }

  readStatement(): ReadResult<L2Base> {
    return this.readExpressionStatement();
  }

  parseStatements(list: L1BasePos[]): L2ParseResult {
    this.pos = 0;
    this.list = list;
    this.current = list[0];

    const outList: L2Base[] = [];
    let error = false;
    while (this.current) {
      const val = this.readStatement();
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = this.current!;
          this.errors.push({
            level: ERROR,
            message: `Unexpected token3`,
            pos: t.pos,
          });
        }
        this.next();
        continue;
      }
      error = false;
      outList.push(val);
    }

    return { list: outList, errors: this.errors };
  }

  parseExpressionList(list: L1BasePos[]): L2ParseExpressionListResult {
    this.pos = 0;
    this.list = list;
    this.current = list[0];

    const outList: L2Expression[] = [];
    let error = false;
    while (this.current) {
      const val = this.readExpression();
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = this.current!;
          this.errors.push({
            level: ERROR,
            message: `Unexpected token4`,
            pos: {
              lin1: t.pos.lin1,
              col1: t.pos.col1,
              lin2: t.pos.lin2,
              col2: t.pos.col2,
            },
          });
        }
        this.next();
        continue;
      }
      outList.push(val);
      error = false;
      if (!this.current) {
        break;
      }
      const t = this.current;
      if (!isOperator(t, ',')) {
        this.errors.push({
          level: ERROR,
          message: `Expected ","`,
          pos: {
            lin1: t.pos.lin1,
            col1: t.pos.col1,
            lin2: t.pos.lin2,
            col2: t.pos.col2,
          },
        });
        this.next();
        continue;
      }
      this.next();
      if (!this.current) {
        this.errors.push({
          level: ERROR,
          message: `Expected expression after ","`,
          pos: {
            lin1: t.pos.lin2,
            col1: t.pos.col2,
            lin2: t.pos.lin2,
            col2: t.pos.col2,
          },
        });
      }
    }
    return { list: outList, errors: this.errors };
  }

  parse(list: L1BasePos[]): L2ParseResult {
    this.pos = 0;
    this.list = list;
    this.current = list[0];

    const outList: L2Base[] = [];
    let error = false;
    while (this.current) {
      const val = this.readToplevel();
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = this.current;
          this.errors.push({
            level: ERROR,
            message: `Unexpected token1`,
            pos: {
              lin1: t.pos.lin1,
              col1: t.pos.col1,
              lin2: t.pos.lin2,
              col2: t.pos.col2,
            },
          });
        }
        this.next();
        continue;
      }
      error = false;
      outList.push(val);
    }
    return { list: outList, errors: this.errors };
  }
}

export function layer2Parse(list: L1BasePos[]) {
  return new L2Parser().parse(list);
}
