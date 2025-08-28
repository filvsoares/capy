import { Operation } from '@/beans/expression/operation';

export class Dereference extends Operation {
  toString(): string {
    return 'dereference';
  }
}
