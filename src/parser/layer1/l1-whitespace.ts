import { L1ParseContext, L1ParserReader } from './l1-types';

function isWhitespace(c: string) {
  return c === ' ' || c === '\t' || c === '\r' || c === '\n';
}

function read(c: L1ParseContext): true | undefined {
  if (!isWhitespace(c.current)) {
    return;
  }
  c.consume();
  while (isWhitespace(c.current)) {
    c.consume();
  }
  return true;
}

export const l1WhitespaceReader: L1ParserReader = { read };
