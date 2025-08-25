import { LocalVariable } from '@/beans/method/local-variable';
import { Identifier } from '@/beans/parser/identifier';

export class MethodStack {
  parent: MethodStack | null;
  items: LocalVariable[];
  itemsByName: { [name: string]: number };

  constructor(parent: MethodStack | null = null) {
    this.parent = parent;
    this.items = parent?.items ?? [];
    this.itemsByName = {};
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

  find(ref: Identifier): number | undefined {
    let current: MethodStack | null = this;
    while (current) {
      const result = this.itemsByName[ref.name];
      if (result !== undefined) {
        return result;
      }
      current = current.parent;
    }
  }

  createChild() {
    return new MethodStack(this);
  }
}
