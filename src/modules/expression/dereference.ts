import { Operation } from '@/modules/expression/operation';

export class Dereference extends Operation {
  toString(): string {
    return 'dereference';
  }
}
