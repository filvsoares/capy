import classes from './toolbar.module.css';

export function Toolbar({ children, className = '' }: { children?: any; className?: string }) {
  return <div className={`${classes.toolbar} ${className}`}>{children}</div>;
}
