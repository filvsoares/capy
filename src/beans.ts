import { declareBeans as d1 } from './beans/l1-reader/_beans';
import { declareBeans as d2 } from './beans/l1-parser/_beans';
import { declareBeans as d3 } from './beans/l2-statement/_beans';
import { declareBeans as d4 } from './beans/l2-toplevel/_beans';
import { declareBeans as d5 } from './beans/l2-type/_beans';
import { declareBeans as d6 } from './beans/l2-parser/_beans';
import { declareBeans as d7 } from './beans/l2-expression/_beans';
import { declareBeans as d8 } from './beans/l2-operation/_beans';

export function declareBeans() {
  d1();
  d2();
  d3();
  d4();
  d5();
  d6();
  d7();
  d8();
}
