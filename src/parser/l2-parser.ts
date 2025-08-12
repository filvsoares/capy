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

import { Base, combinePos, ERROR, fallbackPos, ParseError } from './base';
import { L1Bracket, L1Operator, L1String, L1Base, L1Keyword, L1Number, L1Identifier, L1Separator } from './l1-types';
import {
  L2Addition,
  L2ArraySubscripting,
  L2Base,
  L2Division,
  L2Expression,
  L2Identifier,
  L2MemberAccess,
  L2Method,
  L2Argument,
  L2MethodCall,
  L2Multiplication,
  L2Number,
  L2Operation,
  L2OperationStep,
  L2ParseResult,
  L2Remainder,
  L2String,
  L2Subtraction,
  L2Type,
  L2UnaryMinus,
  L2UnaryPlus,
  L2Use,
  L2Variable,
  L2CallableType,
  L2SimpleType,
  L2Statement,
  L2ExpressionStatement,
  L2ReturnStatement,
  L2Assignment,
} from './l2-types';
import { L3Type } from './l3-types';

function isKeyword(token: any, value?: string): token is L1Keyword {
  return token instanceof L1Keyword && (value === undefined || token.name === value);
}

function isIdentifier(token: any, value?: string): token is L1Identifier {
  return token instanceof L1Identifier && (value === undefined || token.name === value);
}

function isString(token: any, value?: string): token is L1String {
  return token instanceof L1String && (value === undefined || token.value === value);
}

function isOperator(token: any, value?: string): token is L1Operator {
  return token instanceof L1Operator && (value === undefined || token.value === value);
}

function isSeparator(token: any, value?: string): token is L1Separator {
  return token instanceof L1Separator && (value === undefined || token.value === value);
}

function isBracket(token: any, value?: string): token is L1Bracket {
  return token instanceof L1Bracket && (value === undefined || token.start === value);
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

function isExpressionEnd(t: L1Base | undefined) {
  return !t || !(isOperand(t) || isOperator(t));
}

type ReadExpressionOpts = {
  unexpectedTokenErrorMsg?: (t: L1Base | L2Expression) => string;
};

const INVALID = 1;
type Invalid = typeof INVALID;
type ReadResult<T> = T | Invalid | undefined;

class L2Parser {
  pos: number = 0;
  list: L1Base[] = [];
  current: L1Base | undefined;
  errors: ParseError[] = [];

  consume(): void {
    if (!this.current) {
      return;
    }
    this.current = this.list[++this.pos];
  }

  readUse(): ReadResult<L2Use> {
    const t1 = this.current;
    if (!isKeyword(t1, 'use')) {
      return;
    }
    this.consume();

    const t2 = this.current;
    if (!isString(t2)) {
      this.errors.push({
        level: ERROR,
        message: `Expected string`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    this.consume();

    const t3 = this.current;
    if (isSeparator(t3, ';')) {
      this.consume();
    } else {
      this.errors.push({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
    }

    return new L2Use(t2.value, combinePos(t1.pos, (t3 ?? t2).pos));
  }

  readFunction(): ReadResult<L2Method | L2Variable> {
    const t1 = this.current;
    if (!isKeyword(t1, 'function')) {
      return;
    }
    this.consume();

    const t2 = this.current;
    if (!isIdentifier(t2)) {
      this.errors.push({
        level: ERROR,
        message: `Expected string`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    this.consume();

    const t3 = this.current;
    let type = t3 && this.readCallableType();
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      this.errors.push({
        level: ERROR,
        message: `Expected type1`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
      return INVALID;
    }

    const t4 = this.current;
    if (!isBracket(t4, '{')) {
      this.errors.push({
        level: ERROR,
        message: `Expected "{" but found ${t4}`,
        pos: fallbackPos(t4?.pos, type.pos),
      });
      return INVALID;
    }
    this.consume();

    const r = new L2Parser().parseStatementList(t4.tokenList);
    this.errors.push(...r.errors);

    return new L2Method(t2.name, type, r.list, combinePos(t1.pos, t4.pos));
  }

  readVariable(): ReadResult<L2Variable> {
    const t1 = this.current;
    if (!isKeyword(t1, 'var')) {
      return;
    }
    this.consume();

    const t2 = this.current;
    if (!isIdentifier(t2)) {
      this.errors.push({
        level: ERROR,
        message: `Expected string`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }
    this.consume();

    let t3 = this.current;
    if (!isOperator(t3, ':')) {
      this.errors.push({
        level: ERROR,
        message: `Expected ":"`,
        pos: fallbackPos(t3?.pos, t2.pos),
      });
      return INVALID;
    }
    this.consume();

    const t4 = this.current;
    const type = t4 && this.readType();
    if (type === INVALID) {
      return INVALID;
    }
    if (!type) {
      this.errors.push({
        level: ERROR,
        message: `Expected type`,
        pos: fallbackPos(t4?.pos, t3.pos),
      });
      return INVALID;
    }

    t3 = this.current;
    let initExpr: L2Expression | null = null;
    if (isOperator(t3, '=')) {
      this.consume();

      const t4 = this.current;
      const _initExpr = t4 && this.readExpression();
      if (_initExpr === INVALID) {
        return INVALID;
      }
      if (!_initExpr) {
        this.errors.push({
          level: ERROR,
          message: `Expected initializer`,
          pos: fallbackPos(t4?.pos, t3.pos),
        });
        return INVALID;
      }
      initExpr = _initExpr;
    }

    const t5 = this.current;
    if (isSeparator(t5, ';')) {
      this.consume();
    } else {
      this.errors.push({
        level: ERROR,
        message: type === initExpr ? `Expected ";"` : `Expected "=" or ";"`,
        pos: fallbackPos(t5?.pos, t3!.pos),
      });
    }

    return new L2Variable(t2.name, type, initExpr, combinePos(t1.pos, (t5 ?? t2).pos));
  }

  readCallableType(): ReadResult<L2CallableType> {
    const t1 = this.current;
    if (!isBracket(t1, '(')) {
      return;
    }
    this.consume();

    let returnType: L2Type | null = null;

    const r = new L2Parser().parseArgumentList(t1.tokenList);
    this.errors.push(...r.errors);

    const t2 = this.current;
    if (isOperator(t2, ':')) {
      this.consume();

      const _returnType = this.readType();
      if (_returnType === INVALID) {
        return INVALID;
      }
      if (!_returnType) {
        this.errors.push({
          level: ERROR,
          message: `Expected type`,
          pos: t2.pos,
        });
        return INVALID;
      }
      returnType = _returnType;
    }

    return new L2CallableType(r.list, returnType, combinePos(t1.pos, (returnType ?? t1).pos));
  }

  readSimpleType(): ReadResult<L2SimpleType> {
    const t1 = this.current;
    if (isKeyword(t1) || isIdentifier(t1)) {
      this.consume();
      return new L2SimpleType(t1.name, t1.pos);
    }
  }

  readType(): ReadResult<L2Type> {
    return this.readCallableType() || this.readSimpleType();
  }

  readToplevel(): ReadResult<L2Base> {
    return this.readUse() || this.readVariable() || this.readFunction();
  }

  unwrapOperand(operand: L1Base | L2Expression): L2Expression | Invalid {
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
      const r = new L2Parser().parseExpressionList(operand.tokenList, {
        unexpectedTokenErrorMsg: (t) => `Expected ")" but found ${t}`,
      });
      this.errors.push(...r.errors);
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
      message: `Expected expression but found ${operand}`,
      pos: operand.pos,
    });
    return INVALID;
  }

  createOperation(t1: L1Base | L2Expression, step: L2OperationStep): L2Operation | Invalid {
    if (t1 instanceof L2Operation) {
      t1.steps.push(step);
      t1.pos = step.pos;
      return t1;
    }
    const operand = this.unwrapOperand(t1);
    if (operand === INVALID) {
      return INVALID;
    }
    return new L2Operation(operand, [step], step.pos);
  }

  processOperator1(list: (L1Base | L2Expression)[]): (L1Base | L2Expression)[] | Invalid {
    const result: (L1Base | L2Expression)[] = [];

    let t1: L1Base | L2Expression = list[0];
    let i = 1;
    while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      if (isOperand(t1) && isBracket(t2, '(')) {
        const r = new L2Parser().parseExpressionList(t2.tokenList, {
          unexpectedTokenErrorMsg: (t) => `Expected "," or ")" but found ${t}`,
        });
        this.errors.push(...r.errors);
        const operation = this.createOperation(t1, new L2MethodCall(r.list, combinePos(t1.pos, t2.pos)));
        if (operation === INVALID) {
          return INVALID;
        }
        t1 = operation;
        i++;
        continue;
      }

      if (isOperand(t1) && isBracket(t2, '[')) {
        const r = new L2Parser().parseExpressionList(t2.tokenList, {
          unexpectedTokenErrorMsg: (t) => `Expected "]" but found ${t}`,
        });
        this.errors.push(...r.errors);
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
        const operation = this.createOperation(t1, new L2ArraySubscripting(r.list[0], combinePos(t1.pos, t2.pos)));
        if (operation === INVALID) {
          return INVALID;
        }
        t1 = operation;
        i++;
        continue;
      }

      if (isOperand(t1) && isOperator(t2, '.') && isOperand(t3)) {
        if (!(t3 instanceof L1Keyword)) {
          this.errors.push({
            level: ERROR,
            message: `Expected identifier`,
            pos: t3.pos,
          });
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2MemberAccess(t3.name, combinePos(t1.pos, t3.pos)));
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

  processOperator2(list: (L1Base | L2Expression)[]): (L1Base | L2Expression)[] | Invalid {
    list = [...list].reverse();

    const result: (L1Base | L2Expression)[] = [];

    let t1: L1Base | L2Expression = list[0];
    let i = 1;
    while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      if (isOperand(t1) && isOperator(t2, '-') && !isOperand(t3)) {
        const operation = this.createOperation(t1, new L2UnaryMinus(combinePos(t1.pos, t2.pos)));
        if (operation === INVALID) {
          return INVALID;
        }
        t1 = operation;
        i++;
        continue;
      }

      if (isOperand(t1) && isOperator(t2, '+') && !isOperand(t3)) {
        const operation = this.createOperation(t1, new L2UnaryPlus(combinePos(t1.pos, t2.pos)));
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

  processOperator3(list: (L1Base | L2Expression)[]): (L1Base | L2Expression)[] | Invalid {
    const result: (L1Base | L2Expression)[] = [];

    let t1: L1Base | L2Expression = list[0];
    let i = 1;
    while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      if (isOperand(t1) && isOperator(t2, '*') && isOperand(t3)) {
        const operand = this.unwrapOperand(t3);
        if (operand === INVALID) {
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2Multiplication(operand, combinePos(t1.pos, t3.pos)));
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
        const operation = this.createOperation(t1, new L2Division(operand, combinePos(t1.pos, t3.pos)));
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
        const operation = this.createOperation(t1, new L2Remainder(operand, combinePos(t1.pos, t3.pos)));
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

  processOperator4(list: (L1Base | L2Expression)[]): (L1Base | L2Expression)[] | Invalid {
    const result: (L1Base | L2Expression)[] = [];

    let t1: L1Base | L2Expression = list[0];
    let i = 1;
    while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      if (isOperand(t1) && isOperator(t2, '+') && isOperand(t3)) {
        const operand = this.unwrapOperand(t3);
        if (operand === INVALID) {
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2Addition(operand, combinePos(t1.pos, t3.pos)));
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
        const operation = this.createOperation(t1, new L2Subtraction(operand, combinePos(t1.pos, t3.pos)));
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

  processOperator5(list: (L1Base | L2Expression)[]): (L1Base | L2Expression)[] | Invalid {
    list = [...list].reverse();

    const result: (L1Base | L2Expression)[] = [];

    let t1: L1Base | L2Expression = list[0];
    let i = 1;
    while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];

      if (isOperand(t1) && isOperator(t2, '=') && isOperand(t3)) {
        const operand = this.unwrapOperand(t3);
        if (operand === INVALID) {
          return INVALID;
        }
        const operation = this.createOperation(t1, new L2Assignment(operand, combinePos(t1.pos, t3.pos)));
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

  readExpression({ unexpectedTokenErrorMsg }: ReadExpressionOpts = {}): ReadResult<L2Expression> {
    let list: (L1Base | L2Expression)[] = [];

    while (true) {
      const t = this.current;
      if (isExpressionEnd(t)) {
        break;
      }
      list.push(t!);
      this.consume();
    }

    if (list.length === 0) {
      return;
    }

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
    const p5 = this.processOperator5(p4);
    if (p5 === INVALID) {
      return INVALID;
    }

    if (p5.length > 1) {
      console.log(p5);
      this.errors.push({
        level: ERROR,
        message: unexpectedTokenErrorMsg?.(p5[1]) ?? `Unexpected ${p5[1]}`,
        pos: p5[1].pos,
      });
      return INVALID;
    }

    return this.unwrapOperand(p5[0]);
  }

  readExpressionStatement(): ReadResult<L2ExpressionStatement> {
    const val = this.readExpression({
      unexpectedTokenErrorMsg: (t) => `Expected ";" but found ${t}`,
    });
    if (val === INVALID) {
      return INVALID;
    }
    if (!val) {
      return;
    }

    const t = this.current;
    if (isSeparator(t, ';')) {
      this.consume();
    } else {
      this.errors.push({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t?.pos, val.pos),
      });
    }

    return new L2ExpressionStatement(val, combinePos(val.pos, (t ?? val).pos));
  }

  readReturnStatement(): ReadResult<L2ReturnStatement> {
    const t1 = this.current;
    if (!isKeyword(t1, 'return')) {
      return;
    }
    this.consume();

    const t2 = this.current;
    if (isSeparator(t2, ';')) {
      this.consume();
      return new L2ReturnStatement(null, combinePos(t1.pos, t2.pos));
    }

    const val = this.readExpression({
      unexpectedTokenErrorMsg: (t) => `Expected expression but found ${t}`,
    });
    if (val === INVALID) {
      return INVALID;
    }
    if (!val) {
      this.errors.push({
        level: ERROR,
        message: `Expected expression but found ${t2}`,
        pos: fallbackPos(t2?.pos, t1.pos),
      });
      return INVALID;
    }

    const t3 = this.current;
    if (isSeparator(t3, ';')) {
      this.consume();
    } else {
      this.errors.push({
        level: ERROR,
        message: `Expected ";"`,
        pos: fallbackPos(t3?.pos, val.pos),
      });
    }

    return new L2ReturnStatement(val, combinePos(t1.pos, (t3 ?? val).pos));
  }

  readStatement(): ReadResult<L2Statement> {
    return this.readReturnStatement() || this.readExpressionStatement() || this.readVariable();
  }

  parseStatementList(list: L1Base[]): L2ParseResult<L2Statement> {
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
            message: `Unexpected ${t}`,
            pos: t.pos,
          });
        }
        this.consume();
        continue;
      }
      error = false;
      outList.push(val);
    }

    return { list: outList, errors: this.errors };
  }

  parseArgumentList(list: L1Base[]): L2ParseResult<L2Argument> {
    this.pos = 0;
    this.list = list;
    this.current = list[0];

    const outList: L2Argument[] = [];
    let error = false;

    while (this.current) {
      const t1 = this.current;
      if (!isIdentifier(t1)) {
        if (!error) {
          error = true;
          this.errors.push({
            level: ERROR,
            message: `Expected identifier but found ${t1}`,
            pos: t1.pos,
          });
        }
        this.consume();
        continue;
      }
      this.consume();

      const t2 = this.current;
      if (!isOperator(t2, ':')) {
        error = true;
        this.errors.push({
          level: ERROR,
          message: `Expected ":" but found ${t2 ?? '")"'}`,
          pos: fallbackPos(t2?.pos, t1.pos),
        });
        continue;
      }
      this.consume();

      const t3 = this.current;
      const type = this.readType();
      if (!type) {
        error = true;
        this.errors.push({
          level: ERROR,
          message: `Expected type but found ${t3}`,
          pos: fallbackPos(t3?.pos, t2.pos),
        });
        continue;
      }
      if (type === INVALID) {
        error = true;
        continue;
      }

      error = false;
      outList.push(new L2Argument(t1.name, type, combinePos(t1.pos, type.pos)));

      const t4 = this.current;
      if (!t4) {
        break;
      }
      if (!isSeparator(t4, ',')) {
        error = true;
        this.errors.push({
          level: ERROR,
          message: `Expected "," but found ${t4}`,
          pos: t4.pos,
        });
        continue;
      }
      this.consume();

      const t5 = this.current;
      if (!t5) {
        error = true;
        this.errors.push({
          level: ERROR,
          message: `Expected argument after ","`,
          pos: t4.pos,
        });
      }
    }

    return { list: outList, errors: this.errors };
  }

  parseExpressionList(list: L1Base[], opts: ReadExpressionOpts = {}): L2ParseResult<L2Expression> {
    this.pos = 0;
    this.list = list;
    this.current = list[0];

    const outList: L2Expression[] = [];
    let error = false;
    while (this.current) {
      const val = this.readExpression(opts);
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
            message: `Unexpected ${t}`,
            pos: {
              lin1: t.pos.lin1,
              col1: t.pos.col1,
              lin2: t.pos.lin2,
              col2: t.pos.col2,
            },
          });
        }
        this.consume();
        continue;
      }

      outList.push(val);
      error = false;

      const t1 = this.current;
      if (!t1) {
        break;
      }
      if (!isSeparator(t1, ',')) {
        this.errors.push({
          level: ERROR,
          message: `Expected ","`,
          pos: {
            lin1: t1.pos.lin1,
            col1: t1.pos.col1,
            lin2: t1.pos.lin2,
            col2: t1.pos.col2,
          },
        });
        this.consume();
        continue;
      }
      this.consume();

      const t2 = this.current;
      if (!t2) {
        this.errors.push({
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
    return { list: outList, errors: this.errors };
  }

  parse(list: L1Base[]): L2ParseResult {
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
            message: `Unexpected ${t}`,
            pos: {
              lin1: t.pos.lin1,
              col1: t.pos.col1,
              lin2: t.pos.lin2,
              col2: t.pos.col2,
            },
          });
        }
        this.consume();
        continue;
      }
      error = false;
      outList.push(val);
    }
    return { list: outList, errors: this.errors };
  }
}

export function layer2Parse(list: L1Base[]) {
  return new L2Parser().parse(list);
}
