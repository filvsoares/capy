import {
  createContext,
  CSSProperties,
  ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import {
  registeredAnonymousComponent,
  RegisteredComponent,
  registeredTypePart,
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

export type TabTypePart = { title: string };
export const tabTypePart = registeredTypePart<TabTypePart>('tab');
export const tab = registeredAnonymousComponent(tabTypePart);

export const tabsChangedListenerTypePart = registeredTypePart<() => void>('tabsChangedListener');
export const tabsChangedListener = registeredAnonymousComponent(tabsChangedListenerTypePart);

export function useTabsChangedListener(manager: TabManager, callback: () => void) {
  useRegisteredComponent(manager, tabsChangedListener, callback);
  useLayoutEffect(() => {
    callback();
  }, [callback]);
}

export function TabPanel({ manager, className = '', style, children }: TabPanelProps) {
  const { getByType } = manager;

  const [tabHeaders, setTabHeaders] = useState<{ title: string }[]>([]);

  useTabsChangedListener(
    manager,
    useCallback(() => {
      console.log('onTabsChanged');
      setTabHeaders(getByType(tabTypePart));
    }, [getByType])
  );

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

export type TabProps<T> = {
  title: string;
  src: RegisteredComponent<TabTypePart & T>;
  children: ReactNode;
  extend: (data: TabTypePart) => TabTypePart & T;
};

export function AbstractTab<T>({ title, src, extend, children }: TabProps<T>) {
  const manager = useContext(TabContext)!;
  const { getByType } = manager;
  const data = useMemo(() => extend({ title }), [title, extend]);
  useRegisteredComponent(manager, src, data);
  useLayoutEffect(() => {
    getByType(tabsChangedListenerTypePart).forEach((l) => l());
    return () => {
      getByType(tabsChangedListenerTypePart).forEach((l) => l());
    };
  }, [getByType]);
  return children;
}
