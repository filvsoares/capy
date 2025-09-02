import { B as Bean, I as INVALID } from "./index-BncJlCxS.js";
import { D as Dereference } from "./dereference-B5apI-FG.js";
import { E as Expression } from "./expression-DdT-ttwU.js";
import { N as NUMBER } from "./simple-type-BIm_59qh.js";
import { S as StringLiteral } from "./string-literal-BDu2J8WL.js";
import { t as tokenReader } from "./token-reader-BG65ZNxm.js";
import { B as Bracket } from "./bracket-BTNv1ZF5.js";
import { I as Identifier } from "./identifier-CQkte7dE.js";
import { N as Number } from "./number-CdDxkblR.js";
import { S as Separator } from "./separator-D1CNARzn.js";
import { S as String } from "./string-BimwP1qe.js";
import "./operation-DtccBRam.js";
import "./type-CuPJgnn0.js";
import "./token-YbVOofIc.js";
class NumberLiteral extends Expression {
  constructor(value, pos) {
    super(NUMBER, pos);
    this.value = value;
  }
  toString() {
    return `number`;
  }
}
class ExpressionReaderImpl extends Bean {
  constructor(identifierResolvers, operationProcessors) {
    super();
    this.identifierResolvers = identifierResolvers;
    this.operationProcessors = [];
    for (const item of operationProcessors) {
      while (this.operationProcessors.length <= item.pass) {
        this.operationProcessors.push([]);
      }
      this.operationProcessors[item.pass].push(item);
    }
  }
  isExpressionEnd(t) {
    return !t || Separator.matches(t);
  }
  isOperand(obj) {
    return obj instanceof Expression || obj instanceof Identifier || obj instanceof Number || obj instanceof String || obj instanceof Bracket && obj.start === "(";
  }
  internalResolveOperand(c, obj) {
    if (obj instanceof Expression) {
      return obj;
    }
    if (obj instanceof Identifier) {
      return this.resolveIdentifier(c, obj);
    }
    if (obj instanceof Number) {
      return new NumberLiteral(obj.value, obj.pos);
    }
    if (obj instanceof String) {
      return new StringLiteral(obj.value, obj.pos);
    }
    if (obj instanceof Bracket && obj.start === "(") {
      const r = this.readList(c.with(tokenReader(obj.tokenList)), {
        unexpectedTokenErrorMsg: (t) => `Expected ")" but found ${t}`
      });
      if (r.length === 0) {
        c.parseErrors.addError(`Expected expression`, obj.pos);
        return INVALID;
      }
      if (r.length > 1) {
        c.parseErrors.addError(`Expected ")"`, r[1].pos);
        return INVALID;
      }
      return r[0];
    }
    c.parseErrors.addError(`Expected operand but found ${obj}`, obj.pos);
    return INVALID;
  }
  resolveOperand(c, obj, dereference) {
    const operand = this.internalResolveOperand(c, obj);
    if (operand === INVALID) {
      return INVALID;
    }
    if (dereference && operand.isReference) {
      return new Dereference(operand, operand.type, operand.pos);
    }
    return operand;
  }
  processOperationsLTR(c, processors, list) {
    if (!processors) {
      return list;
    }
    const result = [];
    let t1 = list[0];
    let i = 1;
    loop: while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];
      for (const processor of processors) {
        const r = processor.process(c, t1, t2, t3);
        if (!r) {
          continue;
        }
        if (r === INVALID) {
          return INVALID;
        }
        t1 = r.result;
        i += r.skip;
        continue loop;
      }
      result.push(t1);
      t1 = t2;
      i++;
    }
    result.push(t1);
    return result;
  }
  processOperationsRTL(c, processors, list) {
    if (!processors) {
      return list;
    }
    list = [...list].reverse();
    const result = [];
    let t1 = list[0];
    let i = 1;
    loop: while (i < list.length) {
      const t2 = list[i];
      const t3 = list[i + 1];
      for (const processor of processors) {
        const r = processor.process(c, t1, t2, t3);
        if (!r) {
          continue;
        }
        if (r === INVALID) {
          return INVALID;
        }
        t1 = r.result;
        i += r.skip;
        continue loop;
      }
      result.push(t1);
      t1 = t2;
      i++;
    }
    result.push(t1);
    result.reverse();
    return result;
  }
  read(c, { unexpectedTokenErrorMsg } = {}) {
    const list = [];
    while (true) {
      const t = c.tokenReader.current;
      if (this.isExpressionEnd(t)) {
        break;
      }
      list.push(t);
      c.tokenReader.consume();
    }
    if (list.length === 0) {
      return;
    }
    const p1 = this.processOperationsLTR(c, this.operationProcessors[0], list);
    if (p1 === INVALID) {
      return INVALID;
    }
    const p2 = this.processOperationsRTL(c, this.operationProcessors[1], p1);
    if (p2 === INVALID) {
      return INVALID;
    }
    const p3 = this.processOperationsLTR(c, this.operationProcessors[2], p2);
    if (p3 === INVALID) {
      return INVALID;
    }
    const p4 = this.processOperationsLTR(c, this.operationProcessors[3], p3);
    if (p4 === INVALID) {
      return INVALID;
    }
    const p5 = this.processOperationsRTL(c, this.operationProcessors[4], p4);
    if (p5 === INVALID) {
      return INVALID;
    }
    if (p5.length > 1) {
      c.parseErrors.addError((unexpectedTokenErrorMsg == null ? void 0 : unexpectedTokenErrorMsg(p5[1])) ?? `Unexpected ${p5[1]}`, p5[1].pos);
      return INVALID;
    }
    return this.resolveOperand(c, p5[0], true);
  }
  readList(c, opts) {
    const outList = [];
    let error = false;
    while (c.tokenReader.current) {
      const val = this.read(c, opts);
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = c.tokenReader.current;
          c.parseErrors.addError(`Unexpected ${t}`, {
            lin1: t.pos.lin1,
            col1: t.pos.col1,
            lin2: t.pos.lin2,
            col2: t.pos.col2
          });
        }
        c.tokenReader.consume();
        continue;
      }
      outList.push(val);
      error = false;
      const t1 = c.tokenReader.current;
      if (!t1) {
        break;
      }
      if (!Separator.matches(t1, ",")) {
        c.parseErrors.addError(`Expected ","`, {
          lin1: t1.pos.lin1,
          col1: t1.pos.col1,
          lin2: t1.pos.lin2,
          col2: t1.pos.col2
        });
        c.tokenReader.consume();
        continue;
      }
      c.tokenReader.consume();
      const t2 = c.tokenReader.current;
      if (!t2) {
        c.parseErrors.addError(`Expected expression after ","`, {
          lin1: t1.pos.lin2,
          col1: t1.pos.col2,
          lin2: t1.pos.lin2,
          col2: t1.pos.col2
        });
      }
    }
    return outList;
  }
  resolveIdentifier(c, obj) {
    for (const p of this.identifierResolvers) {
      const result = p.resolveIdentifier(c, obj);
      if (result) {
        return result;
      }
    }
    c.parseErrors.addError(`Could not resolve identifier "${obj.name}"`, obj.pos);
    return INVALID;
  }
}
export {
  ExpressionReaderImpl
};
