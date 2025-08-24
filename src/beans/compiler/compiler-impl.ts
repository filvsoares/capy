import { Bean } from '@/util/beans';
import { ERROR, INTERNAL, ParseError } from '../../base';
import { L2Parser, L2ParseResult } from '../l2-parser/l2-parser';
import { L3Module, L3Parser, L3ParseResult } from '../l3-parser/l3-parser';
import { Parser, ParserResult } from '../parser/parser';
import { CompileOpts, Compiler, CompileResult } from './compiler';

export class CompilerImpl extends Bean implements Compiler {
  constructor(private l1Parser: Parser, private l2Parser: L2Parser, private l3Parser: L3Parser) {
    super();
  }

  compile(s: string, libs: L3Module[], { debugL1, debugL2, debugL3 }: CompileOpts): CompileResult {
    const errors: ParseError[] = [];
    const out: string[] = [];

    let p1: ParserResult | undefined;
    let p2: L2ParseResult | undefined;
    let p3: L3ParseResult | undefined;

    try {
      p1 = this.l1Parser.parse(s);
      errors.push(...p1.errors);

      p2 = this.l2Parser.parse(p1.list);
      errors.push(...p2.errors);

      p3 = this.l3Parser.parse('main', p2.list, libs);
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
}
