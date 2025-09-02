import { LocalVariable } from '@/modules/parser/method/local-variable';

export class CgLocalVariable {
  constructor(public variable: LocalVariable, public jsName: string) {}
}
