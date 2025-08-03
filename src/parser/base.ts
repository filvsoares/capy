export abstract class Base {
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

export type Pos = {
  lin1: number;
  col1: number;
  lin2: number;
  col2: number;
};

export class ParseError extends Error {
  lin1: number;
  col1: number;
  lin2: number;
  col2: number;

  constructor(message: string, lin1: number, col1: number, lin2?: number, col2?: number) {
    super(`[${lin1}:${col1} - ${lin2}:${col2}] ${message}`);
    this.lin1 = lin1;
    this.col1 = col1;
    this.lin2 = lin2 ?? lin1;
    this.col2 = col2 ?? col1;
  }
}
