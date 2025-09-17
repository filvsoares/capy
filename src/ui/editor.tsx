import * as ace from 'ace-builds/src-noconflict/ace';
import { CSSProperties, useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import classes from './editor-tab.module.css';

export type EditorHandle = {
  getEditor(): ace.Editor;
};

export type EditorProps = {
  mode?: string;
  theme?: string;
  handle?: { current: EditorHandle | null };
  style?: CSSProperties;
  stretch?: boolean;
};

export function Editor({ mode, handle, theme, style, stretch }: EditorProps) {
  const actualStyle = useMemo(
    () => ({
      ...style,
      ...(stretch ? { width: '100%', height: '100%' } : {}),
    }),
    [style, stretch]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ace.Editor>();

  const getEditor = useCallback(() => editorRef.current!, []);

  useLayoutEffect(() => {
    console.log('create ace');
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

  useLayoutEffect(() => {
    if (handle) {
      handle.current = {
        getEditor,
      };
    }
  }, [handle, getEditor]);

  return <div ref={containerRef} className={classes.editor} style={actualStyle} />;
}
