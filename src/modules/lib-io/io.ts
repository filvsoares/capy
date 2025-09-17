import { Library } from '@/modules/library/library';
import { RunnerController } from '@/modules/runner/runner';
import { Bean } from '@/util/beans';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import sourceCode from './io.capy?raw';

import '@xterm/xterm/css/xterm.css';

export class LibraryIO extends Bean implements Library {
  moduleName = 'lib:io';
  sourceCode = sourceCode;
  nativeMethods(c: RunnerController) {
    const data: {
      term?: Terminal;
      div?: HTMLDivElement;
    } = {};
    const getTerm = () => {
      if (!data.term) {
        data.div = document.createElement('div');
        Object.assign(data.div.style, <CSSStyleDeclaration>{
          width: '100%',
          height: '100%',
        });
        data.term = new Terminal({
          cursorBlink: true,
          fontFamily: 'Inconsolata, monospace',
          fontSize: 16,
          theme: { background: '#FFF', foreground: '#000', cursor: '#000' },
        });

        const fitAddon = new FitAddon();
        data.term.loadAddon(fitAddon);
        new ResizeObserver(() => {
          fitAddon.fit();
        }).observe(data.div);

        data.term.open(data.div);

        c.createTab('Terminal', data.div, { onShow: () => data.term!.focus() });
      }
      return data.term;
    };
    return {
      print(s: string) {
        const term = getTerm();
        term.write(s);
      },
      println(s: string) {
        const term = getTerm();
        term.write(s);
        term.write('\r\n');
      },
      readln() {
        return new Promise((resolve) => {
          let input = '';
          const term = getTerm();
          const handler = term.onData((data) => {
            //console.log(data.length + ' ' + JSON.stringify(data));
            switch (data) {
              case '\u007f':
                if (input.length > 0) {
                  input = input.substring(0, input.length - 1);
                  term!.write('\b \b');
                }
                break;

              case '\r':
                term!.write('\r\n');
                handler.dispose();
                resolve(input);
                break;

              case '\u001b[A':
              case '\u001b[B':
              case '\u001b[C':
              case '\u001b[D':
                break;

              default:
                input += data;
                term!.write(data);
            }
          });
        });
      },
    };
  }
}
