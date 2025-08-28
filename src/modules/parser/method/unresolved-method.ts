import { Method } from '@/modules/parser/method/method';

export class UnresolvedMethod extends Method {
  toString(): string {
    return 'unresolved method';
  }
}
