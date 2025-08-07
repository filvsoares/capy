import { Icon } from 'feather-icons-react';
import classes from './tool-button.module.css';

export function ToolButton({
  text,
  icon: FeatherIcon,
  variant = '',
  onClick,
}: {
  text: string;
  icon?: Icon;
  variant?: '' | 'run';
  onClick?: () => void;
}) {
  return (
    <div className={classes.toolButton} data-variant={variant} onClick={onClick}>
      {FeatherIcon && <FeatherIcon style={{ marginLeft: -4 }} size={20} />}
      {text}
    </div>
  );
}
