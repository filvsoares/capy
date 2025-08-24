import { L3Expression } from './l3-expression-processor';

export abstract class L3Reference extends L3Expression {
  get isReference(): boolean {
    return true;
  }
}
