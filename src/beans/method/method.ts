import { Pos } from '@/base';
import { CallableType } from '@/beans/method/callable-type';
import { Symbol } from '@/beans/parser/symbol';

export abstract class Method extends Symbol {
  constructor(name: string, public type: CallableType, pos: Pos) {
    super(name, pos);
  }
}
