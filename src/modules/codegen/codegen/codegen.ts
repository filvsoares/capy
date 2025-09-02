import { CodegenContext } from '@/modules/codegen/codegen/codegen-context';
import { Application } from '@/modules/parser/parser/application';
import { declareBeanInterface } from '@/util/beans';

export interface Codegen {
  generateCode(application: Application): string;
  getMainModuleName(c: CodegenContext): string;
  getSymbolJsName(c: CodegenContext, moduleName: string, symbolName: string): string;
}

export const codegen = declareBeanInterface<Codegen>('Codegen');
