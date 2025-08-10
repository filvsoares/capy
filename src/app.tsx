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
import { Base, INTERNAL, ParseError } from './parser/base';
import { L3Argument, L3CallableType, L3LibraryMethod, L3Method, L3Module, STRING, VOID } from './parser/l3-types';
import { Runner } from './parser/runner';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github_light_default';
import { layer3Parse } from './parser/l3-parser';
import { Tile } from './ui/tile';
import { compile, CompileResult } from './parser/compiler';
import { Toolbar } from './ui/toolbar';
import { ToolButton } from './ui/tool-button';
import { Play } from 'feather-icons-react';

const initialCode = `use "io";

def start() {
    print(hello("John"));
}

def hello(p: string): string {
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

  const onRunClick = () => {
    const r = compile(content, [io], { debugL2: true, debugL3: true });
    setCompileResult(r);
    if (r.errors.length === 0) {
      const runner = new Runner();
      try {
        runner.run([r.runnable!, io], 'main');
        setTerminalContent(runner.stdout);
      } catch (err: any) {
        setTerminalContent(`Runtime error: ${err.message}`);
      }
    }
  };

  return (
    <div className={classes.container}>
      <Tile className={classes.editor} title='Code editor'>
        <AceEditor
          mode='java'
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
