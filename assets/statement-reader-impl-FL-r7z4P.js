import { B as Bean, b as INVALID, E as ERROR, r as StatementList, I as INTERNAL } from "./index-s97_hl8g.js";
class StatementReaderImpl extends Bean {
  constructor(itemReaders) {
    super();
    this.itemReaders = itemReaders;
    this.itemReaders = itemReaders;
  }
  read(c, context) {
    for (const itemReader of this.itemReaders) {
      const result = itemReader.read(c, context);
      if (result) {
        return result;
      }
    }
  }
  readList(c, context) {
    const outList = [];
    let error = false;
    while (c.current) {
      const val = this.read(c, context);
      if (val === INVALID) {
        error = true;
        continue;
      }
      if (!val) {
        if (!error) {
          error = true;
          const t = c.current;
          c.addError({
            level: ERROR,
            message: `Unexpected ${t}`,
            pos: t.pos
          });
        }
        c.consume();
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
