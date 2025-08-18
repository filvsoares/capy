import { declareBeans as d1 } from './parser/layer1/reader/_bean-declarations';
import { declareBeans as d2 } from './parser/layer1/_bean-declarations';

export function declareBeans() {
  d1();
  d2();
}
