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
import { allocateTabId, Tab, tab, TabOpts, TabPanel } from '@/ui/tab-panel';

import { runner, RunnerController } from '@/modules/runner/runner';
import { Overlay } from '@/ui/overlay';
import { ResizePanel, resizePanelItem } from '@/ui/resize-panel';
import { getSingleBean } from '@/util/beans';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github_light_default';

const initialCode = `use "lib:io";

function start() {

    println("---------");
    println("WELCOME!!");
    println("---------");
    println("");

    print("Your name: ");
    var name1: string = readln();
    println("Hello, " + name1 + "!");

    print("Other name: ");
    var name2: string = readln();
    println(makeGoodbyeText(name1, name2));

}

function makeGoodbyeText(a: string, b: string): string {
    return "Goodbye, " + a + " and " + b + "!";
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

const _parserResultTab: TabOpts = { id: allocateTabId(), title: 'Abstract Syntax Tree', show: 0 };
const _codegenResultTab: TabOpts = { id: allocateTabId(), title: 'Generated Code' };

const _initialSize = window.innerWidth * 0.4;

export default function App() {
  const codeEditorTabRef = useRef<EditorHandle>(null);
  const parserResultTabRef = useRef<EditorHandle>(null);
  const codegenResultTabRef = useRef<EditorHandle>(null);

  const [loading, setLoading] = useState(false);

  const [parserResultTab, setParserResultTab] = useState(_parserResultTab);

  const [runnerTabs, setRunnerTabs] = useState<Tab[]>([]);

  useLayoutEffect(() => {
    codeEditorTabRef.current!.getEditor().setValue(initialCode);
  }, []);

  const onResetClick = async () => {
    codeEditorTabRef.current!.getEditor().setValue(initialCode);
    localStorage.setItem('sourceCode', initialCode);
  };
  const onRunClick = async () => {
    let r;
    setLoading(true);
    try {
      r = await compile(codeEditorTabRef.current?.getEditor().getValue() ?? '', {
        debugTree: true,
      });
      parserResultTabRef.current!.getEditor().setValue(r.parserOutput);
      codegenResultTabRef.current!.getEditor().setValue(r.codegenPrettyOutput);

      if (r.errors.length > 0) {
        setParserResultTab((prv) => ({ ...prv, show: prv.show + 1 }));
        return;
      }
    } finally {
      setLoading(false);
    }

    const controller: RunnerController = {
      createTab(title, content, { onShow } = {}) {
        setRunnerTabs((prv) => [
          ...prv.filter((e) => e.title !== title),
          tab({ id: allocateTabId(), title, show: true, onShow }, <Custom element={content} />),
        ]);
      },
    };
    const _runner = await getSingleBean(runner);
    await _runner.run(r.codegenOutput, controller);
  };

  return (
    <div className={classes.container}>
      {loading && <Overlay />}
      <Toolbar className={classes.toolbar}>
        <ToolButton icon={RefreshCcw} text='Reset' onClick={onResetClick} />
        <ToolButton variant='run' icon={Play} text='Run!' onClick={onRunClick} />
      </Toolbar>
      <ResizePanel className={classes.area} direction='row-reverse'>
        {[
          resizePanelItem(
            { initialSize: _initialSize },
            <TabPanel stretch>
              {[
                tab(
                  parserResultTab,
                  <Editor
                    stretch
                    handle={parserResultTabRef}
                    mode='ace/mode/yaml'
                    theme='ace/theme/github_light_default'
                  />
                ),
                tab(
                  _codegenResultTab,
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
