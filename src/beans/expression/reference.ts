import { Expression } from '@/beans/expression/expression';

export abstract class Reference extends Expression {
  get isReference(): boolean {
    return true;
  }
}
