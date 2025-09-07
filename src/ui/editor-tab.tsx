import { AbstractTab, TabTypePart, tabTypePart } from '@/ui/tab-panel';
import AceEditor from 'react-ace';

import { registeredAnonymousComponent, RegisteredComponent, registeredTypePart } from '@/ui/register-manager';
import { useCallback, useRef, useState } from 'react';
import classes from './editor-tab.module.css';

export type EditorTabTypePart = {
  getValue(): string;
  setValue(s: string): void;
};
export const editorTabTypePart = registeredTypePart<EditorTabTypePart>('editorTab');

export type EditorTabType = TabTypePart & EditorTabTypePart;

export const editorTab = registeredAnonymousComponent(tabTypePart, editorTabTypePart);

export type EditorTabProps = {
  title: string;
  src?: RegisteredComponent<TabTypePart & EditorTabTypePart>;
};

export function EditorTab({ title, src = editorTab }: EditorTabProps) {
  const [value, setValue] = useState<string>('');

  const valueRef = useRef<string>();
  valueRef.current = value;
  const getValue = useCallback(() => valueRef.current!, []);

  const onContentChange = (value: string) => {
    setValue(value);
  };

  const extend = useCallback((data: TabTypePart) => ({ ...data, getValue, setValue }), [getValue]);

  return (
    <AbstractTab title={title} src={src} extend={extend}>
      <AceEditor
        mode='typescript'
        value={value}
        onChange={onContentChange}
        theme='github_light_default'
        width='100%'
        height='100%'
        fontSize={16}
        className={classes.editor}
      />
    </AbstractTab>
  );
}
