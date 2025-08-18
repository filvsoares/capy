import { declareBeans as d1 } from './parser/layer1/reader/_bean-declarations';
import { declareBeans as d2 } from './parser/layer1/_bean-declarations';
import { declareBeans as d3 } from './parser/layer2/reader/statement/_bean-declarations';
import { declareBeans as d4 } from './parser/layer2/reader/toplevel/_bean-declarations';
import { declareBeans as d5 } from './parser/layer2/reader/_bean-declarations';
import { declareBeans as d6 } from './parser/layer2/_bean-declarations';

export function declareBeans() {
  d1();
  d2();
  d3();
  d4();
  d5();
  d6();
}
