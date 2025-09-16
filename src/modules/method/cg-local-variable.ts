import { LocalVariable } from '@/modules/method/local-variable';

export class CgLocalVariable {
  constructor(public variable: LocalVariable, public jsName: string) {}
}
