import { ERROR, INTERNAL, ParseError } from './base';
import { layer1Parse } from './l1-parser';
import { L1ParseResult } from './l1-types';
import { layer2Parse } from './l2-parser';
import { L2ParseResult } from './l2-types';
import { layer3Parse } from './l3-parser';
import { L3Library, L3ParseResult, L3Runnable } from './l3-types';

export type CompileResult = {
  output: string;
  errors: ParseError[];
  runnable?: L3Runnable;
};

export function compile(
  s: string,
  libs: { [name: string]: L3Library },
  { debugL1, debugL2, debugL3 }: { debugL1?: boolean; debugL2?: boolean; debugL3?: boolean }
): CompileResult {
  const errors: ParseError[] = [];
  const out: string[] = [];

  let p1: L1ParseResult | undefined;
  let p2: L2ParseResult | undefined;
  let p3: L3ParseResult | undefined;

  try {
    p1 = layer1Parse(s);
    errors.push(...p1.errors);

    p2 = layer2Parse(p1.list);
    errors.push(...p2.errors);

    p3 = layer3Parse(p2.list, libs);
    errors.push(...p3.errors);
  } catch (err: any) {
    errors.push({ level: ERROR, message: err.stack, pos: INTERNAL });
  }

  if (errors.length === 0) {
    out.push('# Compile successful!\n');
  } else {
    out.push('# Compile errors:\n');
    errors.forEach((item) =>
      out.push(
        `- ${item.pos !== INTERNAL ? `[${item.pos.lin1}:${item.pos.col1}-${item.pos.lin2}:${item.pos.col2}] ` : ''}${
          item.message
        }\n`
      )
    );
  }

  if (debugL1 && p1) {
    out.push('---\n');
    out.push('Layer1Result:\n');
    p1.list.forEach((val) => {
      out.push('  - ');
      val.debugPrint(out, '    ');
    });
  }

  if (debugL2 && p2) {
    out.push('---\n');
    out.push('Layer2Result:\n');
    p2.list.forEach((val) => {
      out.push('  - ');
      val.debugPrint(out, '    ');
    });
  }

  if (debugL3 && p3) {
    out.push('---\n');
    out.push('Layer3Result: ');
    p3.runnable.debugPrint(out, '');
  }

  return {
    errors,
    output: out.join(''),
    runnable: p3?.runnable,
  };
}
