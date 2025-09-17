import { B as Bean } from "./index-DyTq3Mxn.js";
class StatementProcessorImpl extends Bean {
  constructor(statementItemProcessors) {
    super();
    this.statementItemProcessors = statementItemProcessors;
  }
  processStatementList(c, obj, indent) {
    loop: for (const statement of obj.list) {
      let ok = false;
      for (const processor of this.statementItemProcessors) {
        if (processor.processStatement(c, statement, indent)) {
          ok = true;
          continue loop;
        }
      }
      if (!ok) {
        throw new Error(`No statement processor for ${statement.constructor.name}`);
      }
    }
  }
}
export {
  StatementProcessorImpl
};
