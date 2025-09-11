import {
  createContext,
  CSSProperties,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
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

export type TabManager = RegisterManager & {
  showingTabId?: symbol;
  setShowingTabId: (tabId: symbol) => void;
  tabHeaders: TabTypePart[];
};

export const TabContext = createContext<TabManager | null>(null);

export function useTabManager() {
  const registerManager = useRegisterManager();

  const [showingTabId, setShowingTabId] = useState<symbol>();
  const [tabHeaders, setTabHeaders] = useState<TabTypePart[]>([]);

  const tabManager = useMemo<TabManager>(
    () => ({
      ...registerManager,
      showingTabId,
      setShowingTabId,
      tabHeaders,
    }),
    [registerManager, showingTabId, tabHeaders]
  );
  const { getByType } = tabManager;

  useTabsChangedListener(
    tabManager,
    useCallback(() => {
      console.log('onTabsChanged');
      const tabs = getByType(tabTypePart);
      setTabHeaders(tabs);
      setShowingTabId((prv) => {
        for (const tab of tabs) {
          if (tab.tabId === prv) {
            return prv;
          }
        }
        return tabs[0]?.tabId;
      });
    }, [getByType])
  );

  return tabManager;
}

export type TabPanelProps = {
  manager: TabManager;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export type TabTypePart = {
  tabId: symbol;
  title: string;
};

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
  const { tabHeaders, showingTabId, setShowingTabId } = manager;

  return (
    <TabContext.Provider value={manager}>
      <div className={`${classes.container} ${className}`} style={style}>
        <div className={classes.header}>
          {tabHeaders.map((e, i) => (
            <div
              key={i}
              className={classes.headerButton}
              data-selected={e.tabId === showingTabId}
              onClick={() => setShowingTabId(e.tabId)}>
              {e.title}
            </div>
          ))}
          <div className={classes.headerFreeSpace} />
        </div>
        {children}
      </div>
    </TabContext.Provider>
  );
}

export type TabProps<T> = {
  title: string;
  src: RegisteredComponent<TabTypePart & T>;
  children?: ReactNode;
  extend: (data: TabTypePart) => TabTypePart & T;
  containerRef?: RefObject<HTMLDivElement>;
  className?: string;
};

export function AbstractTab<T>({ title, src, extend, children, containerRef, className = '' }: TabProps<T>) {
  const tabIdRef = useRef(Symbol());
  const tabId = tabIdRef.current;

  const manager = useContext(TabContext)!;
  const { getByType, showingTabId } = manager;
  const data = useMemo(() => extend({ tabId, title }), [tabId, title, extend]);
  useRegisteredComponent(manager, src, data);
  useLayoutEffect(() => {
    getByType(tabsChangedListenerTypePart).forEach((l) => l());
    return () => {
      getByType(tabsChangedListenerTypePart).forEach((l) => l());
    };
  }, [getByType]);
  return (
    <div
      ref={containerRef}
      className={`${classes.tab} ${className}`}
      style={{ display: showingTabId === tabId ? '' : 'none' }}>
      {children}
    </div>
  );
}
