import { layer1Parse } from '@/parser/l1-parser';
import { parseToplevel as layer2Parse } from './parser/l2-parser';
import { ChangeEventHandler, useEffect, useState } from 'react';
import classes from './app.module.css';
import { Base } from './parser/base';
import { L3Definition, L3Library } from './parser/l3-types';
import { link as layer3Parse } from './parser/l3-parser';

const initialCode = `use "io";

def global: string;

def start() {
  write("Hello! What is your name?");
}

def sin(x: number): number {
}
`;

const libs: { [name: string]: L3Library } = {
  io: {
    exported: {
      write: new L3Definition(),
    },
  },
};

export default function App() {
  const [content, setContent] = useState(initialCode);
  const [result, setResult] = useState('');

  const onContentChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    try {
      const p1 = layer1Parse(content);
      const p2 = layer2Parse(p1);
      const p3 = layer3Parse(p2, libs);
      setResult(Base.debugPrintList(p2) + '\n\n---\n\n' + p3.debugPrint());
    } catch (err: any) {
      setResult(err.stack);
    }
  });

  return (
    <div className={classes.container}>
      <textarea value={content} onChange={onContentChange}></textarea>
      <div className={classes.result}>{result}</div>
    </div>
  );
}
