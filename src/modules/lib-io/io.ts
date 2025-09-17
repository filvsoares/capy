import { Library } from '@/modules/library/library';
import { RunnerController } from '@/modules/runner/runner';
import { Bean } from '@/util/beans';
import sourceCode from './io.capy?raw';

export class LibraryIO extends Bean implements Library {
  moduleName = 'lib:io';
  sourceCode = sourceCode;
  nativeMethods(c: RunnerController) {
    let tab: HTMLDivElement | undefined;
    const createTab = () => {
      if (!tab) {
        tab = document.createElement('div');
        Object.assign(tab.style, <CSSStyleDeclaration>{
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
        });
        c.createTab('Terminal', tab);
      }
      return tab;
    };
    return {
      print(s: string) {
        createTab().innerText += s + '\n';
      },
    };
  }
}
