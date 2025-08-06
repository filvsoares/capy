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
 * @file Layer-1 parser implementation.
 */

import { ERROR, ParseError } from './base';
import {
  L1Bracket,
  L1Number,
  L1Operator,
  L1String,
  L1Keyword,
  L1Base,
  L1ParseResult,
  L1Identifier,
  KEYWORDS,
  L1Separator,
} from './l1-types';

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

function isSeparator(c: string) {
  return c === ';' || c === ',';
}

type OperatorMap = { [name: string]: true | OperatorMap };

const operatorMap: OperatorMap = {
  '=': { '=': true },
  '+': true,
  '-': true,
  '*': true,
  '/': true,
  ':': true,
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

class L1Parser {
  s: string = '';
  pos: number = 0;
  lin: number = 0;
  col: number = 0;
  current: string = '';
  errors: ParseError[] = [];

  next() {
    if (!this.current) {
      return '';
    }
    this.pos++;
    if (this.pos >= this.s.length) {
      this.current = '';
      return '';
    }
    if (this.current === '\n') {
      this.col = 1;
      this.lin++;
    } else {
      this.col++;
    }
    this.current = this.s[this.pos];
    return this.current;
  }

  readWord(): L1Keyword | L1Identifier | undefined {
    if (!isWordStart(this.current)) {
      return;
    }
    let value = this.current;
    const lin1 = this.lin;
    const col1 = this.col;
    let lin2 = this.lin;
    let col2 = this.col + 1;
    while (isWordMiddle(this.next())) {
      value += this.current;
      lin2 = this.lin;
      col2 = this.col + 1;
    }
    return KEYWORDS.has(value)
      ? new L1Keyword(value, { lin1, col1, lin2, col2 })
      : new L1Identifier(value, { lin1, col1, lin2, col2 });
  }

  readNumber(): L1Number | undefined {
    if (!isNumberStart(this.current)) {
      return;
    }
    let value = this.current;
    const lin1 = this.lin;
    const col1 = this.col;
    let lin2 = this.lin;
    let col2 = this.col + 1;
    while (isNumberMiddle(this.next())) {
      value += this.current;
      lin2 = this.lin;
      col2 = this.col + 1;
    }
    return new L1Number(value, { lin1, col1, lin2, col2 });
  }

  readWhitespace(): true | undefined {
    if (!isWhitespace(this.current)) {
      return;
    }
    while (isWhitespace(this.next())) {}
    return true;
  }

  readOperator(): L1Operator | undefined {
    if (!isOperator(this.current)) {
      return;
    }
    let value = this.current;
    const lin1 = this.lin;
    const col1 = this.col;
    let lin2 = this.lin;
    let col2 = this.col + 1;
    while (this.next() && isOperator(value + this.current)) {
      value += this.current;
      lin2 = this.lin;
      col2 = this.col + 1;
    }
    return new L1Operator(value, { lin1, col1, lin2, col2 });
  }

  readSeparator(): L1Operator | undefined {
    if (!isSeparator(this.current)) {
      return;
    }
    let value = this.current;
    const lin1 = this.lin;
    const col1 = this.col;
    const lin2 = this.lin;
    const col2 = this.col + 1;
    this.next();
    return new L1Separator(value, { lin1, col1, lin2, col2 });
  }

  readBracket(): L1Bracket | undefined {
    if (!isBracketStart(this.current)) {
      return;
    }

    const bracketStart = this.current;
    const expectedBracketEnd =
      bracketStart === '(' ? ')' : bracketStart === '[' ? ']' : bracketStart === '{' ? '}' : '';
    const lin1 = this.lin;
    const col1 = this.col;

    this.next();

    const list: L1Base[] = [];
    while (true) {
      if (!this.current) {
        this.errors.push({
          level: ERROR,
          pos: { lin1: this.lin, col1: this.col, lin2: this.lin, col2: this.col },
          message: `Expected "${expectedBracketEnd}"`,
        });
        break;
      }
      if (isBracketEnd(this.current)) {
        break;
      }
      const item = this.read();
      if (!item) {
        this.errors.push({
          level: ERROR,
          pos: { lin1: this.lin, col1: this.col, lin2: this.lin, col2: this.col + 1 },
          message: `Unexpected char "${this.current}"`,
        });
        this.next();
      }
      if (item instanceof L1Base) {
        list.push(item);
      }
    }

    const lin2 = this.lin;
    const col2 = this.col + 1;

    if (this.current) {
      if (this.current !== expectedBracketEnd) {
        this.errors.push({
          level: ERROR,
          pos: { lin1: this.lin, col1: this.col, lin2: this.lin, col2: this.col + 1 },
          message: `Expected "${expectedBracketEnd}" but found ${this.current}`,
        });
      }
      this.next();
    }

    return new L1Bracket(bracketStart, expectedBracketEnd, list, { lin1, col1, lin2, col2 });
  }

  readString(): L1String | undefined {
    if (this.current !== '"') {
      return;
    }
    let value = '';
    const lin1 = this.lin;
    const col1 = this.col;
    let lin2 = this.lin;
    let col2 = this.col + 1;

    while (true) {
      if (!this.next()) {
        this.errors.push({
          level: ERROR,
          pos: { lin1: this.lin, col1: this.col, lin2: this.lin, col2: this.col },
          message: `Unterminated string`,
        });
        break;
      }
      if (this.current === '"') {
        break;
      }
      value += this.current;
      lin2 = this.lin;
      col2 = this.col + 1;
    }
    this.next();
    return new L1String(value, { lin1, col1, lin2, col2 });
  }

  read(): L1Base | true | undefined {
    return (
      this.readWhitespace() ||
      this.readWord() ||
      this.readOperator() ||
      this.readSeparator() ||
      this.readBracket() ||
      this.readNumber() ||
      this.readString()
    );
  }

  parse(s: string): L1ParseResult {
    this.s = s;
    this.pos = 0;
    this.current = s[0];
    this.lin = 1;
    this.col = 1;

    const list: L1Base[] = [];
    while (this.current) {
      const item = this.read();
      if (!item) {
        this.errors.push({
          level: ERROR,
          pos: { lin1: this.lin, col1: this.col, lin2: this.lin, col2: this.col + 1 },
          message: `Unexpected char "${this.current}"`,
        });
        this.next();
      }
      if (item instanceof L1Base) {
        list.push(item);
      }
    }
    return { list, errors: this.errors };
  }
}

export function layer1Parse(s: string): L1ParseResult {
  return new L1Parser().parse(s);
}
