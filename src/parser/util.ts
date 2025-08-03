export function indent(s: string, level: number) {
  return s.replaceAll('\n', '\n' + ' '.repeat(level));
}
