import { LocalVariable } from '@/modules/parser/method/local-variable';

export class CgMethodStack {
  constructor(public stack: LocalVariable[], public jsNames: string[]) {}
}
