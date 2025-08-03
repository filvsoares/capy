export abstract class Base {
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

  static toString(token: Base | undefined) {
    return token?.toString() ?? 'nothing';
  }

  abstract debugPrint(): string;

  static debugPrintList(list: Base[]) {
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
