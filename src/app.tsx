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

import { Play, RefreshCcw } from 'feather-icons-react';
import { useRef, useState } from 'react';
import AceEditor from 'react-ace';
import classes from './app.module.css';
import { compiler, CompileResult } from './beans/compiler/compiler';
import { Runner } from './runner';
import { Tile } from './ui/tile';
import { ToolButton } from './ui/tool-button';
import { Toolbar } from './ui/toolbar';
import { getBeans } from './util/beans';

import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github_light_default';

const initialCode = `native function print(s: string);

var world: string = "World";

function start() {
    print(hello(world));
}

function hello(p: string): string {
    return "Hello, " + p + "!";
}
`;

export default function App() {
  const [content, setContent] = useState(() => localStorage.getItem('sourceCode') ?? initialCode);
  const [compileResult, setCompileResult] = useState<CompileResult>();
  const [terminalContent, setTerminalContent] = useState<string>();

  const saveTimeoutIdRef = useRef<number>();

  const onContentChange = (value: string) => {
    setContent(value);
    clearTimeout(saveTimeoutIdRef.current);
    saveTimeoutIdRef.current = setTimeout(() => {
      console.log('Saved!');
      localStorage.setItem('sourceCode', value);
    }, 5000);
  };

  const onResetClick = async () => {
    setContent(initialCode);
    localStorage.setItem('sourceCode', initialCode);
  };

  const onRunClick = async () => {
    const _compiler = (await getBeans(compiler))[0];
    const r = _compiler.compile(content, { debugTree: true });
    setCompileResult(r);
    if (r.errors.length === 0) {
      const runner = new Runner();
      try {
        runner.run(r.modules!, 'main');
        setTerminalContent(runner.stdout);
      } catch (err: any) {
        setTerminalContent(`Runtime error: ${err.stack}`);
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.code}>
        <Toolbar>
          <ToolButton icon={RefreshCcw} text='Reset' onClick={onResetClick} />
        </Toolbar>
        <Tile className={classes.editorContainer} title='Code editor'>
          <AceEditor
            mode='typescript'
            theme='github_light_default'
            value={content}
            onChange={onContentChange}
            width='100%'
            height='100%'
            fontSize={16}
            className={classes.editor}
          />
        </Tile>
      </div>

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
            className={classes.editor}
          />
        </Tile>
        <Tile className={classes.terminal} title='Terminal'>
          <div className={`${classes.terminalContent} ${classes.editor}`}>{terminalContent}</div>
        </Tile>
      </div>
    </div>
  );
}
