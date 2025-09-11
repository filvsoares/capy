import { MouseEventHandler, ReactNode, useLayoutEffect, useMemo, useRef } from 'react';

import classes from './resize-panel.module.css';

export type ResizePanelItemOpts = {
  initialSize?: number;
};

export type ResizePanelItem = ResizePanelItemOpts & {
  children: ReactNode;
};

export function resizePanelItem(opts: ResizePanelItemOpts, children: ReactNode): ResizePanelItem {
  return { ...opts, children };
}

export type ResizePanelProps = { children: ResizePanelItem[]; className?: string };

export function ResizePanel({ children, className = '' }: ResizePanelProps) {
  const prvChildrenRef = useRef<ResizePanelItem[]>();
  const itemNodesRef = useRef<{ [index: number]: HTMLDivElement | null }>({});

  const actualChildren = useMemo(() => {
    const val: ReactNode[] = [];
    for (let i = 0; i < children.length; i++) {
      val.push(
        <div
          className={`${classes.item}`}
          data-last={i == children.length - 1}
          key={`${i}c`}
          ref={(node) => {
            itemNodesRef.current[i] = node;
            return () => {
              delete itemNodesRef.current[i];
            };
          }}>
          {children[i].children}
        </div>
      );

      if (i < children.length - 1) {
        const index = i;
        const onMouseDown: MouseEventHandler = (e) => {
          const initialCoord = e.clientX;
          const initialWidth = itemNodesRef.current[index]!.clientWidth;
          const onMouseMove = (e: MouseEvent) => {
            itemNodesRef.current[index]!.style.width = e.clientX - initialCoord + initialWidth + 'px';
          };
          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        };

        val.push(<div className={classes.handle} key={`${i}h`} onMouseDown={onMouseDown} />);
      }
    }
    return val;
  }, [children]);

  useLayoutEffect(() => {
    for (let i = 0; i < children.length; i++) {
      const item = children[i];
      const prvItem = prvChildrenRef.current?.[i];
      const node = itemNodesRef.current[i];
      if (!node) {
        continue;
      }
      if (!prvItem || prvItem.initialSize !== item.initialSize) {
        if (item) {
          node.style.width = item.initialSize + 'px';
        }
      }
    }
    prvChildrenRef.current = children;
  });

  return <div className={`${classes.container} ${className}`}>{actualChildren}</div>;
}
