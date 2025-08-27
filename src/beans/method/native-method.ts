import { Pos } from '@/base';
import { CallableType } from '@/beans/method/callable-type';
import { Method } from '@/beans/method/method';

export class NativeMethod extends Method {
  constructor(module: string, name: string, type: CallableType, pos: Pos) {
    super(module, name, type, pos);
  }

  toString(): string {
    return 'native method';
  }
}
