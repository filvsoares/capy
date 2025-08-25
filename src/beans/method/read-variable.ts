import { Operation } from '@/beans/expression/operation';

export class ReadVariable extends Operation {
  get isReference(): boolean {
    return false;
  }
  toString(): string {
    return 'variable read';
  }
}
