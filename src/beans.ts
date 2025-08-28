import { declareBeans as d10 } from './modules/parser/compiler/_beans';
import { declareBeans as d7 } from './modules/parser/expression/_beans';
import { declareBeans as d11 } from './modules/parser/global-variable/_beans';
import { declareBeans as d1 } from './modules/parser/impexp/_beans';
import { declareBeans as d4 } from './modules/parser/method/_beans';
import { declareBeans as d8 } from './modules/parser/operation/_beans';
import { declareBeans as d2 } from './modules/parser/parser/_beans';
import { declareBeans as d3 } from './modules/parser/statement/_beans';
import { declareBeans as d9 } from './modules/parser/tokenizer/_beans';
import { declareBeans as d5 } from './modules/parser/type/_beans';

export function declareBeans() {
  d1();
  d2();
  d3();
  d4();
  d5();
  d7();
  d8();
  d9();
  d10();
  d11();
}
