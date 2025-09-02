import { Application } from '@/modules/parser/parser/application';
import { declareBeanInterface } from '@/util/beans';

export interface Codegen {
  generateCode(application: Application): string[];
}

export const codegen = declareBeanInterface<Codegen>('Codegen');
