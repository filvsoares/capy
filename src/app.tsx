/**
 * Capy project.
 * Copyright (c) 2025 - Filipe Vilela Soares
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @file App component.
 */

import { layer1Parse } from '@/parser/l1-parser';
import { layer2Parse } from './parser/l2-parser';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import classes from './app.module.css';
import { Base, ParseError } from './parser/base';
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
    const out: string[] = [];
    try {
      const errors: ParseError[] = [];
      try {
        const p1 = layer1Parse(content);
        errors.push(...p1.errors);
        //p1.list.forEach((val) => val.debugPrint(out, ''));
        const p2 = layer2Parse(p1.list);
        errors.push(...p2.errors);
        out.push('---\n');
        p2.list.forEach((val) => val.debugPrint(out, ''));
        const p3 = layer3Parse(p2.list, libs);
        out.push('---\n');
        p3.debugPrint(out, '');
        if (errors.length == 0) {
          const r = new Runner(p3);
          r.run();
          out.push('---\n');
          out.push(r.stdout);
        }
      } finally {
        if (errors.length > 0) {
          out.push('---\n');
          errors.forEach((item) =>
            out.push(
              `[${item.pos && `${item.pos.lin1}:${item.pos.col1}-${item.pos.lin2}:${item.pos.col2}] `}${item.message}`
            )
          );
        }
      }
    } catch (err: any) {
      out.push('---');
      out.push(err.stack);
    }
    setResult(out.join(''));
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
