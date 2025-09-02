import { CgSymbol } from '@/modules/codegen/codegen/cg-symbol';
import { CodegenData } from '@/modules/codegen/codegen/codegen-data';
import { CodegenWriter } from '@/modules/codegen/codegen/codegen-writer';
import { declareBeanInterface } from '@/util/beans';
import { Context } from '@/util/context';

export interface SymbolProcessor {
  processSymbol(c: Context<CodegenWriter & CodegenData>, obj: CgSymbol, indent: string): boolean | undefined;
}

export const symbolProcessor = declareBeanInterface<SymbolProcessor>('SymbolProcessor');
