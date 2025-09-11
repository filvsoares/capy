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
import { useCallback, useRef } from 'react';
import classes from './app.module.css';
import { compile } from './compiler';
import { ToolButton } from './ui/tool-button';
import { Toolbar } from './ui/toolbar';

import { EditorTab, EditorTabType, editorTabTypePart } from '@/ui/editor-tab';
import { registeredComponent } from '@/ui/register-manager';
import { TabPanel, tabTypePart, useTabManager, useTabsChangedListener } from '@/ui/tab-panel';

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

export const codeEditor = registeredComponent(tabTypePart, editorTabTypePart);
export const parserResult = registeredComponent(tabTypePart, editorTabTypePart);
export const codegenResult = registeredComponent(tabTypePart, editorTabTypePart);

export default function App() {
  const codeEditorTabRef = useRef<EditorTabType>();
  const parserResultTabRef = useRef<EditorTabType>();
  const codegenResultTabRef = useRef<EditorTabType>();

  const onResetClick = async () => {
    codeEditorTabRef.current?.getEditor().setValue(initialCode);
    localStorage.setItem('sourceCode', initialCode);
  };
  const onRunClick = async () => {
    const r = await compile(codeEditorTabRef.current?.getEditor().getValue() ?? '', { debugTree: true });
    parserResultTabRef.current?.getEditor().setValue(r.parserOutput);
    codegenResultTabRef.current?.getEditor().setValue(r.codegenOutput ?? '');
  };

  const tm1 = useTabManager();
  const { getByInstance: tm1GetByInstance } = tm1;

  const tm2 = useTabManager();
  const { getByInstance: tm2GetByInstance } = tm2;

  useTabsChangedListener(
    tm1,
    useCallback(() => {
      const codeEditorTab = tm1GetByInstance(codeEditor);
      if (codeEditorTab !== codeEditorTabRef.current) {
        codeEditorTabRef.current = codeEditorTab;
        if (codeEditorTab) {
          codeEditorTab.getEditor().setValue(initialCode);
        }
      }
    }, [tm1GetByInstance])
  );

  useTabsChangedListener(
    tm2,
    useCallback(() => {
      parserResultTabRef.current = tm2GetByInstance(parserResult);
      codegenResultTabRef.current = tm2GetByInstance(codegenResult);
    }, [tm2GetByInstance])
  );

  return (
    <div className={classes.container}>
      <div className={classes.code}>
        <Toolbar>
          <ToolButton icon={RefreshCcw} text='Reset' onClick={onResetClick} />
        </Toolbar>
        <TabPanel manager={tm1} className={classes.editorContainer}>
          <EditorTab src={codeEditor} title='main' mode='ace/mode/typescript' theme='ace/theme/github_light_default' />
        </TabPanel>
      </div>

      <div className={classes.result}>
        <Toolbar>
          <ToolButton variant='run' icon={Play} text='Run!' onClick={onRunClick} />
        </Toolbar>
        <TabPanel manager={tm2} className={classes.editorContainer}>
          <EditorTab
            src={parserResult}
            title='Abstract Syntax Tree'
            mode='ace/mode/yaml'
            theme='ace/theme/github_light_default'
          />
          <EditorTab
            src={codegenResult}
            title='Generated Code'
            mode='ace/mode/javascript'
            theme='ace/theme/github_light_default'
          />
        </TabPanel>
      </div>
    </div>
  );
}
