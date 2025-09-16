import { CodegenData } from '@/modules/codegen/codegen-data';
import { CodegenWriter } from '@/modules/codegen/codegen-writer';
import { Application } from '@/modules/parser/application';
import { declareBeanInterface } from '@/util/beans';

export type CodegenContext = {
  codegenWriter: CodegenWriter;
  codegenData: CodegenData;
};

export interface Codegen {
  generateCode(application: Application): string[];
}

export const codegen = declareBeanInterface<Codegen>('Codegen');
