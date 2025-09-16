import { Method } from '@/modules/method/method';

export class UnresolvedMethod extends Method {
  toString(): string {
    return 'unresolved method';
  }
}
