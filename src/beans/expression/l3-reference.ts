import { L3Expression } from '@/beans/expression/l3-expression';

export abstract class L3Reference extends L3Expression {
  get isReference(): boolean {
    return true;
  }
}
