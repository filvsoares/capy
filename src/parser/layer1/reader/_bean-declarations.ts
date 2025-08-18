import { declareBean } from '@/util/beans';
import { l1Reader } from './_bean-interfaces';
import { l1Parser } from '../_bean-interfaces';

export function declareBeans() {
  declareBean(
    [l1Reader],
    async (r) =>
      new (await import('./l1-bracket')).L1BracketReader({
        parsers: await r.getBeans(l1Parser),
      })
  );
  declareBean([l1Reader], async () => new (await import('./l1-number')).L1NumberReader());
  declareBean([l1Reader], async () => new (await import('./l1-operator')).L1OperatorReader());
  declareBean([l1Reader], async () => new (await import('./l1-separator')).L1SeparatorReader());
  declareBean([l1Reader], async () => new (await import('./l1-string')).L1StringReader());
  declareBean([l1Reader], async () => new (await import('./l1-whitespace')).L1WhitespaceReader());
  declareBean([l1Reader], async () => new (await import('./l1-word')).L1WordReader());
}
