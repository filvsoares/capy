import classes from './tile.module.css';

export function Tile({ children, title, className = '' }: { className?: string; title?: string; children?: any }) {
  return (
    <div className={`${classes.tile} ${className}`}>
      {title && <div className={classes.header}>{title}</div>}
      <div className={classes.content}>{children}</div>
    </div>
  );
}
