import { Symbol } from '@/modules/parser/parser/symbol';

export class CgSymbol {
  constructor(public symbol: Symbol, public jsName: string) {}
}
