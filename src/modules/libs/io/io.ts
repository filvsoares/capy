import { Library } from '@/modules/libs/base/library';
import { Bean } from '@/util/beans';
import sourceCode from './io.capy?raw';

export class LibraryIO extends Bean implements Library {
  moduleName = 'lib:io';
  sourceCode = sourceCode;
  nativeMethods = {
    print(s: string) {
      alert(s);
    },
  };
}
