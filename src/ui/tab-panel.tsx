import { CSSProperties, ReactNode, useMemo, useState } from 'react';

import classes from './tab-panel.module.css';

export type TabOpts = {
  title: string;
};

export type Tab = TabOpts & {
  children: ReactNode;
};

export function tab(opts: TabOpts, children: ReactNode) {
  return { ...opts, children };
}

export type TabPanelProps = {
  className?: string;
  style?: CSSProperties;
  children: Tab[];
  stretch?: boolean;
};

export function TabPanel({ className = '', style, stretch, children }: TabPanelProps) {
  const [showingTabIndex, setShowingTabIndex] = useState(0);

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
            key={i}
            className={classes.headerButton}
            data-selected={i === showingTabIndex}
            onClick={() => setShowingTabIndex(i)}>
            {e.title}
          </div>
        ))}
        <div className={classes.headerFreeSpace} />
      </div>
      {children.map((e, i) => (
        <div key={i} className={classes.tab} style={{ display: i === showingTabIndex ? '' : 'none' }}>
          {e.children}
        </div>
      ))}
    </div>
  );
}
