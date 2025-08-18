import { ERROR, INTERNAL, ParseError } from './base';
import { L1ParseResult } from './layer1/l1-types';
import { layer2Parse } from './layer2/l2-parser';
import { L2ParseResult } from './layer2/l2-types';
import { layer3Parse } from './l3-parser';
import { L3ParseResult, L3Module } from './l3-types';
import { l1Parser } from './layer1/_bean-interfaces';
import { BeanResolver } from '@/util/beans';

export type CompileResult = {
  output: string;
  errors: ParseError[];
  runnable?: L3Module;
};

export async function compile(
  s: string,
  libs: L3Module[],
  { debugL1, debugL2, debugL3 }: { debugL1?: boolean; debugL2?: boolean; debugL3?: boolean }
): Promise<CompileResult> {
  const errors: ParseError[] = [];
  const out: string[] = [];

  let p1: L1ParseResult | undefined;
  let p2: L2ParseResult | undefined;
  let p3: L3ParseResult | undefined;

  const l1ParserImpl = (await new BeanResolver().getBeans(l1Parser))[0];

  try {
    p1 = l1ParserImpl.parse(s);
    errors.push(...p1.errors);

    p2 = layer2Parse(p1.list);
    errors.push(...p2.errors);

    p3 = layer3Parse('main', p2.list, libs);
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
