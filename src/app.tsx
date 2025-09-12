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
import { useLayoutEffect, useRef } from 'react';
import classes from './app.module.css';
import { compile } from './compiler';
import { ToolButton } from './ui/tool-button';
import { Toolbar } from './ui/toolbar';

import { Editor, EditorHandle } from '@/ui/editor';
import { tab, TabPanel } from '@/ui/tab-panel';

import { ResizePanel, resizePanelItem } from '@/ui/resize-panel';
import 'ace-builds/src-noconflict/mode-javascript';
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
  const codeEditorTabRef = useRef<EditorHandle>(null);
  const parserResultTabRef = useRef<EditorHandle>(null);
  const codegenResultTabRef = useRef<EditorHandle>(null);

  useLayoutEffect(() => {
    codeEditorTabRef.current!.getEditor().setValue(initialCode);
  }, []);

  const onResetClick = async () => {
    codeEditorTabRef.current!.getEditor().setValue(initialCode);
    localStorage.setItem('sourceCode', initialCode);
  };
  const onRunClick = async () => {
    const r = await compile(codeEditorTabRef.current?.getEditor().getValue() ?? '', { debugTree: true });
    parserResultTabRef.current!.getEditor().setValue(r.parserOutput);
    codegenResultTabRef.current!.getEditor().setValue(r.codegenOutput ?? '');
  };

  return (
    <div className={classes.container}>
      <Toolbar className={classes.toolbar}>
        <ToolButton icon={RefreshCcw} text='Reset' onClick={onResetClick} />
        <ToolButton variant='run' icon={Play} text='Run!' onClick={onRunClick} />
      </Toolbar>
      <ResizePanel className={classes.area} direction='row-reverse'>
        {[
          resizePanelItem(
            { initialSize: 300 },
            <TabPanel stretch>
              {[
                tab(
                  { title: 'Abstract Syntax Tree' },
                  <Editor
                    stretch
                    handle={parserResultTabRef}
                    mode='ace/mode/yaml'
                    theme='ace/theme/github_light_default'
                  />
                ),
                tab(
                  { title: 'Generated Code' },
                  <Editor
                    stretch
                    handle={codegenResultTabRef}
                    mode='ace/mode/javascript'
                    theme='ace/theme/github_light_default'
                  />
                ),
              ]}
            </TabPanel>
          ),
          resizePanelItem(
            {},
            <TabPanel stretch>
              {[
                tab(
                  { title: 'main' },
                  <Editor
                    stretch
                    handle={codeEditorTabRef}
                    mode='ace/mode/typescript'
                    theme='ace/theme/github_light_default'
                  />
                ),
              ]}
            </TabPanel>
          ),
        ]}
      </ResizePanel>
    </div>
  );
}
