import { CSSProperties, ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';

import classes from './tab-panel.module.css';

export type TabOpts = {
  id: string;
  title: string;
  show?: any;
  onShow?(): void;
};

export type Tab = TabOpts & {
  children: ReactNode;
};

let id = 0;
export function allocateTabId() {
  return String(id++);
}

export function tab(opts: TabOpts, children: ReactNode): Tab {
  return { ...opts, children };
}

export type TabPanelProps = {
  className?: string;
  style?: CSSProperties;
  children: Tab[];
  stretch?: boolean;
};

export function TabPanel({ className = '', style, stretch, children }: TabPanelProps) {
  const prvTabsRef = useRef<{ [id: string]: Tab }>({});

  const [showingTabId, setShowingTabId] = useState(children[0]?.id);

  const tabs = useMemo(() => {
    const tabs: { [id: string]: Tab } = {};
    for (const tab of children) {
      tabs[tab.id] = tab;
    }
    return tabs;
  }, [children]);

  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  useLayoutEffect(() => {
    for (const id in tabs) {
      const tab = tabs[id];
      const prvTab = prvTabsRef.current[id];

      if (tab.show && tab.show !== prvTab?.show) {
        setShowingTabId(id);
      }
    }
    prvTabsRef.current = tabs;
  }, [tabs]);

  useLayoutEffect(() => {
    const tab = tabsRef.current[showingTabId];
    if (tab) {
      tab.onShow?.();
    }
  }, [showingTabId]);

  const actualStyle = useMemo(
    () => ({
      ...style,
      ...(stretch ? { width: '100%', height: '100%' } : {}),
    }),
    [style, stretch]
  );

  return (
    <div className={`${classes.container} ${className}`} style={actualStyle}>
      <div className={classes.header}>
        {children.map((e, i) => (
          <div
            key={e.id}
            className={classes.headerButton}
            data-selected={e.id === showingTabId}
            onClick={() => setShowingTabId(e.id)}>
            {e.title}
          </div>
        ))}
        <div className={classes.headerFreeSpace} />
      </div>
      {children.map((e, i) => (
        <div key={e.id} className={classes.tab} style={{ display: e.id === showingTabId ? '' : 'none' }}>
          {e.children}
        </div>
      ))}
    </div>
  );
}
