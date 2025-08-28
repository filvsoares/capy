import { Pos } from '@/base';
import { CallableType } from '@/modules/parser/method/callable-type';
import { Method } from '@/modules/parser/method/method';

export type NativeMethodCallback = (runner: any, ...args: any[]) => any;

export class NativeMethod extends Method {
  constructor(module: string, name: string, type: CallableType, public callback: NativeMethodCallback, pos: Pos) {
    super(module, name, type, pos);
  }

  toString(): string {
    return 'native method';
  }
}
