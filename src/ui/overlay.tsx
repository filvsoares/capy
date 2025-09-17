import { createPortal } from 'react-dom';

import classes from './overlay.module.css';

export function Overlay() {
  return createPortal(<div className={classes.overlay} />, document.getElementById('overlay-div')!);
}
