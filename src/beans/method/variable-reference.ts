import { Expression } from '@/beans/expression/expression';

export abstract class VariableReference extends Expression {
  get isReference(): boolean {
    return true;
  }
}
