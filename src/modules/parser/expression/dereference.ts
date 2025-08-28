import { Operation } from '@/modules/parser/expression/operation';

export class Dereference extends Operation {
  toString(): string {
    return 'dereference';
  }
}
