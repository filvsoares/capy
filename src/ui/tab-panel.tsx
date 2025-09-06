import { createContext, CSSProperties, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import {
  componentsChangedListener,
  registeredComponentType,
  RegisterManager,
  useRegisteredComponent,
  useRegisterManager,
} from '@/ui/register-manager';
import classes from './tab-panel.module.css';

export type TabManager = RegisterManager;

export const TabContext = createContext<TabManager | null>(null);

export function useTabManager() {
  return useRegisterManager();
}

export type TabPanelProps = {
  manager: TabManager;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export const tab = registeredComponentType<{ title: string }>('tab');

export function TabPanel({ manager, className = '', style, children }: TabPanelProps) {
  const [tabHeaders, setTabHeaders] = useState<{ title: string }[]>([]);

  const { getByType } = manager;
  const onComponentsChanged = useCallback(() => {
    console.log('onComponentsChanged');
    setTabHeaders(getByType(tab));
  }, [getByType]);

  useRegisteredComponent(manager, componentsChangedListener, onComponentsChanged);

  return (
    <TabContext.Provider value={manager}>
      <div className={`${classes.container} ${className}`} style={style}>
        <div className={classes.header}>
          {tabHeaders.map((e, i) => (
            <div key={i} className={classes.headerButton}>
              {e.title}
            </div>
          ))}
        </div>
        {children}
      </div>
    </TabContext.Provider>
  );
}

export function Tab({ title }: { title: string }) {
  const manager = useContext(TabContext)!;
  const data = useMemo(() => ({ title }), [title]);
  useRegisteredComponent(manager, tab, data);
  return <></>;
}
