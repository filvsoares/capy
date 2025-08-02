import { parseText } from '@/parser/text-parser';
import { parseToplevel } from './parser/toplevel-parser';
import { ChangeEventHandler, useEffect, useState } from 'react';
import classes from './app.module.css';
import { Token } from './parser/token';

const initialCode = `use "chat";

def global: string;

def start() {
  write("Hello! What is your name?");
}

def sin(x: number): number {
}
`;

export default function App() {
  const [content, setContent] = useState(initialCode);
  const [result, setResult] = useState('');

  const onContentChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    try {
      const p1 = parseText(content);
      const p2 = parseToplevel(p1);
      setResult(Token.debugPrintList(p2));
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
