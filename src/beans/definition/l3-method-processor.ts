import { ERROR } from '@/base';
import { Bean } from '@/util/beans';
import { L2Identifier } from '../expression/l2-expression';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L3ToplevelProcessor } from '../l3-parser/l3-toplevel-processor';
import { L2StatementList } from '../statement/l2-statement-list';
import { L3StatementProcessor } from '../statement/l3-statement-processor';
import { L3TypeProcessor } from '../type/l3-type-processor';
import { INVALID, L3ArgumentVariable, L3CapyMethod, L3LocalVariable, L3UnresolvedMethod } from '../type/l3-types';
import { L2Definition } from './l2-definition';
import { L2Method } from './l2-method';

export class MethodStack {
  parent: MethodStack | null;
  items: L3LocalVariable[];
  itemsByName: { [name: string]: number };

  constructor(parent: MethodStack | null = null) {
    this.parent = parent;
    this.items = parent?.items ?? [];
    this.itemsByName = {};
  }

  add(item: L3LocalVariable): number | false {
    const existing = this.itemsByName[item.name];
    if (existing !== undefined) {
      return false;
    }
    const index = this.items.length;
    this.items.push(item);
    this.itemsByName[item.name] = index;
    return index;
  }

  find(ref: L2Identifier): number | undefined {
    let current: MethodStack | null = this;
    while (current) {
      const result = this.itemsByName[ref.value];
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

export class L3MethodProcessor extends Bean implements L3ToplevelProcessor {
  constructor(private l3TypeProcessor: L3TypeProcessor, private l3StatementProcessor: L3StatementProcessor) {
    super();
  }

  process(c: L3ParseContext, def: L2Definition): boolean {
    if (!(def instanceof L2Method)) {
      return false;
    }
    const type = this.l3TypeProcessor.processCallableType(c, def.type);
    if (type === INVALID) {
      return true;
    }
    const dst = new L3UnresolvedMethod(def.name, type, def.pos);
    if (!c.addToMySymbols(dst)) {
      c.errors.push({
        level: ERROR,
        message: `Symbol "${dst.name}" already defined`,
        pos: def.pos,
      });
    }
    c.deferredTasks.push(() => {
      this.resolveMethod(c, dst, def.statementList);
    });
    return true;
  }

  resolveMethod(c: L3ParseContext, src: L3UnresolvedMethod, srcStatementList: L2StatementList) {
    const stack = new MethodStack();

    for (let i = 0; i < src.type.argList.length; i++) {
      const arg = src.type.argList[i];
      stack.add(new L3ArgumentVariable(i, arg.name, arg.type, arg.pos));
    }

    const statementList = this.l3StatementProcessor.processStatementList(
      c,
      srcStatementList,
      stack,
      src.type.returnType
    );

    const dst = new L3CapyMethod(src.name, src.type, stack.items, statementList, src.pos);
    c.replaceInMySymbols(dst);
  }
}
