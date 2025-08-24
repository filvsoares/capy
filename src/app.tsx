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

import { Play } from 'feather-icons-react';
import { useState } from 'react';
import AceEditor from 'react-ace';
import classes from './app.module.css';
import { INTERNAL } from './base';
import { compiler, CompileResult } from './beans/compiler/compiler';
import { STRING, VOID } from './beans/type/l3-simple-type';
import { Runner } from './runner';
import { Tile } from './ui/tile';
import { ToolButton } from './ui/tool-button';
import { Toolbar } from './ui/toolbar';
import { getBeans } from './util/beans';

import { L3Argument } from '@/beans/method/l3-argument';
import { L3CallableType } from '@/beans/method/l3-callable-type';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github_light_default';
import { L3Module } from './beans/l3-parser/l3-parser';
import { L3LibraryMethod } from './beans/method/l3-method';

const initialCode = `use "io";

function start() {
    print(hello("John"));
}

function hello(p: string): string {
    return "Hello, " + p + "!";
}
`;

const io = new L3Module('io', [
  new L3LibraryMethod(
    'print',
    new L3CallableType([new L3Argument('s', STRING, INTERNAL)], VOID, INTERNAL),
    ([s], runner) => {
      runner.print(s);
    }
  ),
]);

export default function App() {
  const [content, setContent] = useState(initialCode);
  const [compileResult, setCompileResult] = useState<CompileResult>();
  const [terminalContent, setTerminalContent] = useState<string>();

  const onContentChange = (value: string) => {
    setContent(value);
  };

  const onRunClick = async () => {
    const _compiler = (await getBeans(compiler))[0];
    const r = _compiler.compile(content, [io], { debugL1: true, debugL2: true, debugL3: true });
    setCompileResult(r);
    if (r.errors.length === 0) {
      const runner = new Runner();
      try {
        runner.run([r.runnable!, io], 'main');
        setTerminalContent(runner.stdout);
      } catch (err: any) {
        setTerminalContent(`Runtime error: ${err.stack}`);
      }
    }
  };

  return (
    <div className={classes.container}>
      <Tile className={classes.editor} title='Code editor'>
        <AceEditor
          mode='typescript'
          theme='github_light_default'
          value={content}
          onChange={onContentChange}
          width='100%'
          height='100%'
          fontSize={16}
          className={classes.code}
        />
      </Tile>
      <div className={classes.result}>
        <Toolbar>
          <ToolButton variant='run' icon={Play} text='Run!' onClick={onRunClick} />
        </Toolbar>
        <Tile className={classes.compileOutput} title='Compile output'>
          <AceEditor
            mode='yaml'
            theme='github_light_default'
            value={compileResult?.output ?? ''}
            readOnly={true}
            width='100%'
            height='100%'
            fontSize={16}
            className={classes.code}
          />
        </Tile>
        <Tile className={classes.terminal} title='Terminal'>
          <div className={`${classes.terminalContent} ${classes.code}`}>{terminalContent}</div>
        </Tile>
      </div>
    </div>
  );
}
