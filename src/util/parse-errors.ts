import { ERROR, INTERNAL, ParseError, Pos } from '@/base';

export class ParseErrors {
  constructor(public errors: ParseError[]) {}

  addError(message: string, pos: Pos = INTERNAL) {
    this.errors.push({ level: ERROR, message, pos });
  }
}
