import { declareBeans as d10 } from './beans/compiler/_beans';
import { declareBeans as d4 } from './beans/definition/_beans';
import { declareBeans as d7 } from './beans/expression/_beans';
import { declareBeans as d1 } from './beans/impexp/_beans';
import { declareBeans as d2 } from './beans/l1-parser/_beans';
import { declareBeans as d6 } from './beans/l2-parser/_beans';
import { declareBeans as d9 } from './beans/l3-parser/_beans';
import { declareBeans as d8 } from './beans/operation/_beans';
import { declareBeans as d3 } from './beans/statement/_beans';
import { declareBeans as d5 } from './beans/type/_beans';

export function declareBeans() {
  d1();
  d2();
  d3();
  d4();
  d5();
  d6();
  d7();
  d8();
  d9();
  d10();
}
