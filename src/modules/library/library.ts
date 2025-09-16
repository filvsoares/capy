import { declareBeanInterface } from '@/util/beans';

export interface Library {
  moduleName: string;
  sourceCode: string;
  nativeMethods: { [name: string]: (...args: any[]) => any };
}

export const library = declareBeanInterface<Library>('Library');
