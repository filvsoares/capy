import { ERROR } from '@/base';
import { INVALID } from '@/beans/l3-parser/l3-base';
import { Bean } from '@/util/beans';
import { L2Expression } from '../expression/l2-expression';
import { L3ExpressionProcessor } from '../expression/l3-expression-processor';
import { L2Definition } from '../impexp/l2-definition';
import { L3ParseContext } from '../l3-parser/l3-parser';
import { L3ToplevelProcessor } from '../l3-parser/l3-toplevel-processor';
import { L3Variable } from '../method/l3-method';
import { L3TypeProcessor } from '../type/l3-type-processor';
import { L2Variable } from './l2-variable';

export class L3VariableProcessor extends Bean implements L3ToplevelProcessor {
  constructor(private l3TypeProcessor: L3TypeProcessor, private l3ExpressionProcessor: L3ExpressionProcessor) {
    super();
  }

  process(c: L3ParseContext, def: L2Definition): boolean {
    if (!(def instanceof L2Variable)) {
      return false;
    }
    const type = this.l3TypeProcessor.processType(c, def.type);
    if (type === INVALID) {
      return true;
    }
    const dst = new L3Variable(def.name, type, null, def.pos);
    if (!c.addToMySymbols(dst)) {
      c.errors.push({
        level: ERROR,
        message: `Symbol "${dst.name}" already defined`,
        pos: def.pos,
      });
    }
    if (def.initExpr) {
      c.deferredTasks.push(() => {
        this.processVariableInitializer(c, dst, def.initExpr!);
      });
    }
    return true;
  }

  processVariableInitializer(c: L3ParseContext, variable: L3Variable, initExpr: L2Expression) {
    const l3expr = this.l3ExpressionProcessor.processExpression(c, initExpr, null);
    if (l3expr === INVALID) {
      return;
    }
    variable.initExpr = l3expr;
  }
}
