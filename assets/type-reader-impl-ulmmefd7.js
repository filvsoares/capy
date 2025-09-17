import { B as Bean } from "./index-3ZiCjh5_.js";
class TypeReaderImpl extends Bean {
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
  isAssignable(type, assignTo) {
    for (const p of this.itemReaders) {
      const result = p.isAssignable(type, assignTo);
      if (typeof result === "boolean") {
        return result;
      }
    }
    return false;
  }
}
export {
  TypeReaderImpl
};
