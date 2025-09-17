import { LocalVariable } from '@/modules/method/local-variable';
import { Type } from '@/modules/type/type';
import { declareExtraKey } from '@/util/extra';

export const methodData = declareExtraKey<MethodData>('MethodData');

export class MethodData {
  parent: MethodData | null;
  items: LocalVariable[];
  itemsByName: { [name: string]: number };
  returnType: Type;

  constructor(parent: MethodData | null, returnType: Type) {
    this.parent = parent;
    this.items = parent?.items ?? [];
    this.itemsByName = {};
    this.returnType = returnType;
  }

  add(item: LocalVariable): number | false {
    const existing = this.itemsByName[item.name];
    if (existing !== undefined) {
      return false;
    }
    const index = this.items.length;
    this.items.push(item);
    this.itemsByName[item.name] = index;
    return index;
  }

  find(name: string): number | undefined {
    let current: MethodData | null = this;
    while (current) {
      const result = this.itemsByName[name];
      if (result !== undefined) {
        return result;
      }
      current = current.parent;
    }
  }

  createChild() {
    return new MethodData(this, this.returnType);
  }
}
