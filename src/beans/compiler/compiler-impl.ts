import { methodExtraKey } from '@/beans/method/method-extra';
import { ModuleInput } from '@/beans/parser/module-input';
import { Runner } from '@/runner';
import { Bean } from '@/util/beans';
import { ERROR, INTERNAL, ParseError } from '../../base';
import { Parser, ParserResult } from '../parser/parser';
import { CompileOpts, Compiler, CompileResult } from './compiler';

const nativeMethods = {
  print(runner: Runner, s: string) {
    runner.print(s);
  },
};

export class CompilerImpl extends Bean implements Compiler {
  constructor(private parser: Parser) {
    super();
  }

  compile(sourceCode: string, { debugTree }: CompileOpts): CompileResult {
    const errors: ParseError[] = [];
    const out: string[] = [];

    let p: ParserResult | undefined;

    try {
      p = this.parser.parse({
        main: new ModuleInput(sourceCode).withExtra(methodExtraKey, { nativeMethods }),
      });
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
      out.push('ParserResult:\n');
      Object.values(p.modules).forEach((m) =>
        Object.values(m.symbols).forEach((e) => {
          out.push('- ');
          e.debugPrint(out, '  ');
        })
      );
    }

    return {
      errors,
      output: out.join(''),
      modules: p?.modules,
    };
  }
}
