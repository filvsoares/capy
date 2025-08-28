import { CgSymbol } from '@/modules/codegen/codegen/cg-symbol';
import { CodegenContext } from '@/modules/codegen/codegen/codegen';
import { declareBeanInterface } from '@/util/beans';

export interface SymbolProcessor {
  processSymbol(c: CodegenContext, obj: CgSymbol): boolean | undefined;
}

export const symbolProcessor = declareBeanInterface<SymbolProcessor>('SymbolProcessor');
