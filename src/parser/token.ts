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

function indent(s: string, level: number) {
  return s.replaceAll('\n', '\n' + ' '.repeat(level));
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

  debugPrint(): string {
    return `[Token] ${this.toString()}`;
  }

  isExpression(): boolean {
    return false;
  }

  static debugPrintList(list: Token[]) {
    let s = '';
    for (const item of list) {
      if (s) {
        s += '\n';
      }
      s += item.debugPrint();
    }
    return s;
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

  debugPrint(): string {
    return `[Word]\n  value: ${this.value}`;
  }

  isExpression(): boolean {
    return true;
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

  debugPrint(): string {
    return `[Operator]\n  value:${this.value}`;
  }
}

export class Bracket extends Token {
  start: string;
  end: string;
  tokenList: Token[];

  constructor(start: string, end: string, tokenList: Token[]) {
    super();
    this.start = start;
    this.end = end;
    this.tokenList = tokenList;
  }

  toString(): string {
    return `bracket "${this.start}"`;
  }

  debugPrint(): string {
    return `[Bracket]\n  start: ${this.start}\n  list:\n${this.tokenList
      .map((item) => '    - ' + indent(item.debugPrint(), 6))
      .join('\n')}`;
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

  isExpression(): boolean {
    return true;
  }

  debugPrint(): string {
    return `[Number]\n  value: ${this.value}`;
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

  isExpression(): boolean {
    return true;
  }

  debugPrint(): string {
    return `[String]\n  value: ${this.value}`;
  }
}

export class MethodCall extends Token {
  method: Token;
  argList: Token[];

  constructor(method: Token, argList: Token[]) {
    super();
    this.method = method;
    this.argList = argList;
  }

  toString(): string {
    return `${this.method.toString()}`;
  }

  isExpression(): boolean {
    return true;
  }

  debugPrint(): string {
    return `[MethodCall]\n  method: ${indent(this.method.debugPrint(), 2)}\n  args:\n${this.argList
      .map((item) => '    - ' + indent(item.debugPrint(), 6))
      .join('\n')}`;
  }
}

export class ArraySubscripting extends Token {
  array: Token;
  item: Token;

  constructor(array: Token, item: Token) {
    super();
    this.array = array;
    this.item = item;
  }

  toString(): string {
    return `${this.array.toString()}`;
  }

  isExpression(): boolean {
    return true;
  }

  debugPrint(): string {
    return `[ArraySubscripting]\n  array: ${indent(this.array.debugPrint(), 2)}\n  item: ${indent(
      this.item.debugPrint(),
      2
    )}`;
  }
}

export class MemberAccess extends Token {
  parent: Token;
  child: Token;

  constructor(parent: Token, child: Token) {
    super();
    this.parent = parent;
    this.child = child;
  }

  toString(): string {
    return `${this.parent.toString()}`;
  }

  isExpression(): boolean {
    return true;
  }

  debugPrint(): string {
    return `[MemberAccess]\n  parent: ${indent(this.parent.debugPrint(), 2)}\n  child: ${indent(
      this.child.debugPrint(),
      2
    )}`;
  }
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

  debugPrint(): string {
    return `[Use]\n  value: ${this.value}`;
  }
}

export class Method extends Token {
  name: string;
  returnType: Type | undefined;
  statementList: Token[];

  constructor(name: string, returnType: Type | undefined, statementList: Token[]) {
    super();
    this.name = name;
    this.returnType = returnType;
    this.statementList = statementList;
  }

  toString(): string {
    return `method "${this.name}"`;
  }

  debugPrint(): string {
    return `[Method]\n  name: ${this.name}\n  statements:\n${this.statementList
      .map((item) => '    - ' + indent(item.debugPrint(), 6))
      .join('\n')}`;
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

  debugPrint(): string {
    return `[Variable] ${this.name}: ${this.type.debugPrint()}`;
  }
}

export class Type extends Token {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  toString(): string {
    return `type ${this.name}`;
  }

  debugPrint(): string {
    return `[Type] ${this.name}`;
  }
}
