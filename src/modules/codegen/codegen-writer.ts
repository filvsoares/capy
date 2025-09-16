export class CodegenWriter {
  constructor(public out: string[]) {}
  write(...s: string[]) {
    this.out.push(...s);
  }
}
