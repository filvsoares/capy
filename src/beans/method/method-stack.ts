import { LocalVariable } from '@/beans/method/local-variable';
import { StatementContext } from '@/beans/statement/statement-context';
import { Identifier } from '@/beans/tokenizer/identifier';
import { Type } from '@/beans/type/type';

export class MethodStack implements StatementContext {
  parent: MethodStack | null;
  items: LocalVariable[];
  itemsByName: { [name: string]: number };
  returnType: Type;

  constructor(parent: MethodStack | null = null, returnType: Type) {
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
    return new MethodStack(this, this.returnType);
  }
}
