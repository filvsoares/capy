import { declareBean } from '@/util/beans';
import { l1Parser } from './_bean-interfaces';
import { l1Reader } from './reader/_bean-interfaces';

export function declareBeans() {
  declareBean(
    [l1Parser],
    async (r) =>
      new (await import('./l1-parser')).L1ParserImpl({
        readers: await r.getBeans(l1Reader),
      })
  );
}
