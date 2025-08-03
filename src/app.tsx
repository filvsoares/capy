import { layer1Parse } from '@/parser/l1-parser';
import { parseToplevel as layer2Parse } from './parser/l2-parser';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import classes from './app.module.css';
import { Base } from './parser/base';
import { L3CallableType, L3Definition, L3Library, L3LibraryMethod, L3Method } from './parser/l3-types';
import { link as layer3Parse } from './parser/l3-parser';
import { Runner } from './parser/runner';

const initialCode = `use "io";

def start() {
  print("Hello! What is your name?");
}
`;

const libs: { [name: string]: L3Library } = {
  io: {
    exported: {
      print: new L3LibraryMethod(new L3CallableType(), ([s], runner) => {
        runner.print(s);
      }),
    },
  },
};

export default function App() {
  const [content, setContent] = useState(initialCode);
  const [result, setResult] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  const onContentChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    let s = '';
    try {
      const p1 = layer1Parse(content);
      //s += Base.debugPrintList(p1);
      const p2 = layer2Parse(p1);
      s += '\n---\n' + Base.debugPrintList(p2);
      const p3 = layer3Parse(p2, libs);
      s += '\n---\n' + p3.debugPrint();
      const r = new Runner(p3);
      r.run();
      s += '\n---\n' + r.stdout;
    } catch (err: any) {
      s += '\n---\n' + err.stack;
    }
    setResult(s);
  });

  useEffect(() => {
    const div = resultRef.current;
    if (!div) {
      return;
    }
    div.scrollTop = div.scrollHeight;
  }, [result]);

  return (
    <div className={classes.container}>
      <textarea value={content} onChange={onContentChange}></textarea>
      <div ref={resultRef} className={classes.result}>
        {result}
      </div>
    </div>
  );
}
