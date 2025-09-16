import { CgSymbol } from '@/modules/codegen/cg-symbol';
import { CodegenContext } from '@/modules/codegen/codegen';
import { declareBeanInterface } from '@/util/beans';

export interface SymbolProcessor {
  processSymbol(c: CodegenContext, obj: CgSymbol, indent: string): boolean | undefined;
}

export const symbolProcessor = declareBeanInterface<SymbolProcessor>('SymbolProcessor');
