import { Method } from '@/beans/method/method';

export class UnresolvedMethod extends Method {
  toString(): string {
    return 'unresolved method';
  }
}
