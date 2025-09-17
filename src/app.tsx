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
import { useLayoutEffect, useRef, useState } from 'react';
import classes from './app.module.css';
import { compile } from './compiler';
import { ToolButton } from './ui/tool-button';
import { Toolbar } from './ui/toolbar';

import { Editor, EditorHandle } from '@/ui/editor';
import { allocateTabId, Tab, tab, TabPanel } from '@/ui/tab-panel';

import { RunnerController } from '@/modules/runner/runner';
import { ResizePanel, resizePanelItem } from '@/ui/resize-panel';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github_light_default';

const initialCode = `use "lib:io";

var world: string = "World";

function start() {
    print(hello(world));
}

function hello(p: string): string {
    return "Hello, " + p + "!";
}
`;

function Custom({ element }: { element?: HTMLElement }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const container = containerRef.current!;
    if (element) {
      container.appendChild(element);
      return () => {
        container.removeChild(element);
      };
    }
  });

  return <div style={{ width: '100%', height: '100%' }} ref={containerRef} />;
}

const codeEditorTabId = allocateTabId();
const parserResultTabId = allocateTabId();
const codegenResultTabId = allocateTabId();

export default function App() {
  const codeEditorTabRef = useRef<EditorHandle>(null);
  const parserResultTabRef = useRef<EditorHandle>(null);
  const codegenResultTabRef = useRef<EditorHandle>(null);

  const [runnerTabs, setRunnerTabs] = useState<Tab[]>([]);

  useLayoutEffect(() => {
    codeEditorTabRef.current!.getEditor().setValue(initialCode);
  }, []);

  const onResetClick = async () => {
    codeEditorTabRef.current!.getEditor().setValue(initialCode);
    localStorage.setItem('sourceCode', initialCode);
  };
  const onRunClick = async () => {
    const controller: RunnerController = {
      createTab(title, content) {
        setRunnerTabs((prv) => [
          ...prv.filter((e) => e.title !== title),
          tab({ id: allocateTabId(), title, show: true }, <Custom element={content} />),
        ]);
      },
    };
    const r = await compile(codeEditorTabRef.current?.getEditor().getValue() ?? '', controller, {
      debugTree: true,
    });
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
            { initialSize: 800 },
            <TabPanel stretch>
              {[
                tab(
                  { id: parserResultTabId, title: 'Abstract Syntax Tree' },
                  <Editor
                    stretch
                    handle={parserResultTabRef}
                    mode='ace/mode/yaml'
                    theme='ace/theme/github_light_default'
                  />
                ),
                tab(
                  { id: codegenResultTabId, title: 'Generated Code' },
                  <Editor
                    stretch
                    handle={codegenResultTabRef}
                    mode='ace/mode/javascript'
                    theme='ace/theme/github_light_default'
                  />
                ),
                ...runnerTabs,
              ]}
            </TabPanel>
          ),
          resizePanelItem(
            {},
            <TabPanel stretch>
              {[
                tab(
                  { id: codeEditorTabId, title: 'main' },
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
