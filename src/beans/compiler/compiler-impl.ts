import { Module } from '@/beans/parser/module';
import { Tokenizer } from '@/beans/tokenizer/tokenizer';
import { Bean } from '@/util/beans';
import { ERROR, INTERNAL, ParseError } from '../../base';
import { Parser, ParserResult } from '../parser/parser';
import { CompileOpts, Compiler, CompileResult } from './compiler';

export class CompilerImpl extends Bean implements Compiler {
  constructor(private tokenizer: Tokenizer, private parser: Parser) {
    super();
  }

  compile(s: string, libs: Module[], { debugTree }: CompileOpts): CompileResult {
    const errors: ParseError[] = [];
    const out: string[] = [];

    let p: ParserResult | undefined;

    try {
      p = this.parser.parse({ main: s });
      errors.push(...p.errors);
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

    if (debugTree && p) {
      out.push('---\n');
      out.push('ParserResult: ');
      Object.values(p.modules['main']).forEach((e) => e.debugPrint(out, ''));
    }

    return {
      errors,
      output: out.join(''),
      modules: p?.modules,
    };
  }
}
