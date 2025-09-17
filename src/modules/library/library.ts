import { RunnerController } from '@/modules/runner/runner';
import { declareBeanInterface } from '@/util/beans';

export interface Library {
  moduleName: string;
  sourceCode: string;
  nativeMethods(c: RunnerController): { [name: string]: (...args: any[]) => any };
}

export const library = declareBeanInterface<Library>('Library');
