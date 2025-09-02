import { LocalVariable } from '@/modules/parser/method/local-variable';
import { Identifier } from '@/modules/parser/tokenizer/identifier';
import { Type } from '@/modules/parser/type/type';
import { Context, ContextValue } from '@/util/context';

export type MethodData = ContextValue<'methodData', MethodDataImpl>;

export function methodData(parent: MethodData | null, returnType: Type): MethodData {
  return { methodData: new MethodDataImpl(parent?.methodData ?? null, returnType) };
}

export function hasMethodData(c: Context<Partial<MethodData>>): c is Context<MethodData> {
  return c.methodData !== undefined;
}

export class MethodDataImpl {
  parent: MethodDataImpl | null;
  items: LocalVariable[];
  itemsByName: { [name: string]: number };
  returnType: Type;

  constructor(parent: MethodDataImpl | null, returnType: Type) {
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
    let current: MethodDataImpl | null = this;
    while (current) {
      const result = this.itemsByName[ref.name];
      if (result !== undefined) {
        return result;
      }
      current = current.parent;
    }
  }

  createChild() {
    return new MethodDataImpl(this, this.returnType);
  }
}
