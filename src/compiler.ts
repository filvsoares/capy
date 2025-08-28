import { ERROR, INTERNAL, ParseError } from '@/base';
import { declareAllBeans } from '@/beans';
import { codegen } from '@/modules/codegen/codegen/codegen';
import { methodExtraKey } from '@/modules/parser/method/method-extra';
import { Module } from '@/modules/parser/parser/module';
import { ModuleInput } from '@/modules/parser/parser/module-input';
import { parser, ParserResult } from '@/modules/parser/parser/parser';
import { Runner } from '@/runner';
import { getBeans } from '@/util/beans';

const nativeMethods = {
  print(runner: Runner, s: string) {
    runner.print(s);
  },
};

export type CompileResult = {
  parserOutput: string;
  codegenOutput?: string;
  errors: ParseError[];
  modules?: { [moduleName: string]: Module };
};

export async function compile(sourceCode: string, { debugTree }: { debugTree?: boolean }): Promise<CompileResult> {
  await declareAllBeans();
  const _parser = (await getBeans(parser))[0];
  const _codegen = (await getBeans(codegen))[0];

  const errors: ParseError[] = [];
  const out: string[] = [];

  let p: ParserResult | undefined;

  try {
    p = _parser.parse({
      main: new ModuleInput(sourceCode).withExtra(methodExtraKey, { nativeMethods }),
    });
    errors.push(...p.errors);
  } catch (err: any) {
    errors.push({ level: ERROR, message: err.stack, pos: INTERNAL });
  }

  let codegenOutput: string | undefined;
  if (errors.length === 0) {
    try {
      codegenOutput = _codegen.generateCode(p!.modules);
    } catch (err: any) {
      errors.push({ level: ERROR, message: err.stack, pos: INTERNAL });
    }
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
    modules: p?.modules,
    parserOutput: out.join(''),
    codegenOutput,
  };
}
