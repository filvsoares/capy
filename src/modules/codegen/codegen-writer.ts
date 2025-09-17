export type Content = string | Content[];

export class CodegenWriter {
  constructor(public out: Content[]) {}
  write(...s: Content[]) {
    this.out.push(...s);
  }
  reserve() {
    const data: Content[] = [];
    this.out.push(data);
    return new CodegenWriter(data);
  }
}
