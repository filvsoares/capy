import { ContextValue } from '@/util/context';

export type CodegenWriter = ContextValue<
  'codegenWriter',
  {
    write(...s: string[]): void;
  }
>;

export function codegenWriter(out: string[]): CodegenWriter {
  return {
    codegenWriter: {
      write(...s: string[]) {
        out.push(...s);
      },
    },
  };
}
