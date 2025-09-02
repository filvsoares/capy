import { ERROR, INTERNAL, ParseError, Pos } from '@/base';
import { ContextValue } from '@/util/context';

export type ParseErrors = ContextValue<
  'parseErrors',
  {
    errors: ParseError[];
    addError(message: string, pos?: Pos): void;
  }
>;

export function parseErrors(errors: ParseError[]): ParseErrors {
  return {
    parseErrors: {
      errors,
      addError(message, pos = INTERNAL) {
        errors.push({ level: ERROR, message, pos });
      },
    },
  };
}
