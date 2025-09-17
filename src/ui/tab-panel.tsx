import { CSSProperties, ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';

import classes from './tab-panel.module.css';

export type TabOpts = {
  id: number;
  title: string;
  show?: any;
};

export type Tab = TabOpts & {
  children: ReactNode;
};

let id = 0;
export function allocateTabId() {
  return id++;
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

  useLayoutEffect(() => {
    const tabs: { [id: string]: Tab } = {};
    for (const tab of children) {
      tabs[tab.id] = tab;
      const prvTab = prvTabsRef.current[tab.id];

      if (tab.show && tab.show !== prvTab?.show) {
        setShowingTabId(tab.id);
      }
    }
    prvTabsRef.current = tabs;
  }, [children]);

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
