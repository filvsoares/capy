import { B as Bean, I as INVALID, e as INTERNAL } from "./index-BncJlCxS.js";
import { S as Statement } from "./statement-BEQNu2Pd.js";
class StatementList extends Statement {
  constructor(list, pos) {
    super(pos);
    this.list = list;
  }
  toString() {
    return `statement list`;
  }
  debugPrint(out, prefix) {
    super.debugPrint(out, prefix);
    out.push(`${prefix}  list:
`);
    this.list.forEach((val) => {
      out.push(`${prefix}    - `);
      val.debugPrint(out, `${prefix}      `);
    });
  }
}
class StatementReaderImpl extends Bean {
  constructor(itemReaders) {
    super();
    this.itemReaders = itemReaders;
    this.itemReaders = itemReaders;
  }
  read(c) {
    for (const itemReader of this.itemReaders) {
      const result = itemReader.read(c);
      if (result) {
        return result;
      }
    }
  }
  readList(c) {
    const outList = [];
    let error = false;
    while (c.tokenReader.current) {
      const val = this.read(c);
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = c.tokenReader.current;
          c.parseErrors.addError(`Unexpected ${t}`, t.pos);
        }
        c.tokenReader.consume();
        continue;
      }
      error = false;
      outList.push(val);
    }
    return new StatementList(outList, INTERNAL);
  }
}
export {
  StatementReaderImpl
};
