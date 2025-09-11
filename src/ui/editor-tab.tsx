import { AbstractTab, TabTypePart, tabTypePart } from '@/ui/tab-panel';

import { registeredAnonymousComponent, RegisteredComponent, registeredTypePart } from '@/ui/register-manager';
import * as ace from 'ace-builds/src-noconflict/ace';
import { useCallback, useLayoutEffect, useRef } from 'react';

import classes from './editor-tab.module.css';

export type EditorTabTypePart = {
  getEditor(): ace.Editor;
};
export const editorTabTypePart = registeredTypePart<EditorTabTypePart>('editorTab');

export type EditorTabType = TabTypePart & EditorTabTypePart;

export const editorTab = registeredAnonymousComponent(tabTypePart, editorTabTypePart);

export type EditorTabProps = {
  title: string;
  src?: RegisteredComponent<TabTypePart & EditorTabTypePart>;
  mode?: string;
  theme?: string;
};

export function EditorTab({ title, src = editorTab, mode, theme }: EditorTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ace.Editor>();

  const getEditor = useCallback(() => editorRef.current!, []);
  const extend = useCallback((data: TabTypePart) => ({ ...data, getEditor }), [getEditor]);

  useLayoutEffect(() => {
    editorRef.current = ace.edit(containerRef.current!);
  }, []);

  useLayoutEffect(() => {
    if (theme) {
      editorRef.current!.setTheme(theme);
    }
  }, [theme]);

  useLayoutEffect(() => {
    if (mode) {
      editorRef.current!.session.setMode(mode);
    }
  }, [mode]);

  return <AbstractTab title={title} src={src} extend={extend} containerRef={containerRef} className={classes.editor} />;
}
