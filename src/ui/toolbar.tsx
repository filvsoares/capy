import classes from './toolbar.module.css';

export function Toolbar({ children }: { children?: any }) {
  return <div className={classes.toolbar}>{children}</div>;
}
