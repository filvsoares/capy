import { INTERNAL } from '@/base';
import { CallableType } from '@/beans/method/callable-type';
import { Method } from '@/beans/method/method';
import { Runner } from '@/runner';

export class LibraryMethod extends Method {
  callback: (args: any[], runner: Runner) => any;

  constructor(name: string, type: CallableType, callback: (args: any[], runner: Runner) => any) {
    super(name, type, INTERNAL);
    this.callback = callback;
  }

  toString(): string {
    return 'method';
  }
}
