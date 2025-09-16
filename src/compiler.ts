import { ERROR, INTERNAL, ParseError } from '@/base';
import { declareAllBeans } from '@/beans';
import { codegen } from '@/modules/codegen/codegen';
import { ModuleInput } from '@/modules/parser/module-input';
import { parser, ParserResult } from '@/modules/parser/parser';
import { getSingleBean } from '@/util/beans';

export type CompileResult = {
  parserOutput: string;
  codegenOutput?: string;
  terminalOutput?: string;
  errors: ParseError[];
};

export async function compile(sourceCode: string, { debugTree }: { debugTree?: boolean }): Promise<CompileResult> {
  await declareAllBeans();
  const _parser = await getSingleBean(parser);
  const _codegen = await getSingleBean(codegen);

  const errors: ParseError[] = [];
  const out: string[] = [];

  let p: ParserResult | undefined;

  try {
    p = await _parser.parse([new ModuleInput('main', sourceCode)]);
    errors.push(...p.errors);
  } catch (err: any) {
    errors.push({ level: ERROR, message: err.stack, pos: INTERNAL });
  }

  let codegenOutput: string[] | undefined;
  if (errors.length === 0) {
    try {
      codegenOutput = _codegen.generateCode(p!.application);
    } catch (err: any) {
      errors.push({ level: ERROR, message: err.stack, pos: INTERNAL });
    }
  }

  let codegenPrettyOutput: string | undefined;
  let terminalOutput: string | undefined;
  if (codegenOutput) {
    codegenPrettyOutput =
      `function app(${codegenOutput.slice(0, -1).join(', ')}) {\n` +
      `  ${codegenOutput[codegenOutput.length - 1].replaceAll('\n', '\n  ').trimEnd()}` +
      `\n}\n`;

    /*const app = new Function(...codegenOutput);
    const terminalLines: string[] = [];
    const nativeMethods = {
      'main.print'(s: string) {
        terminalLines.push(s);
      },
    };
    try {
      app(nativeMethods);
    } catch (err: any) {
      terminalLines.push(err.stack);
    }
    terminalOutput = terminalLines.join('\n');*/
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
    Object.values(p.application.symbols).forEach((s) => {
      out.push('- ');
      s.debugPrint(out, '  ');
    });
  }

  return {
    errors,
    parserOutput: out.join(''),
    codegenOutput: codegenPrettyOutput,
    terminalOutput,
  };
}
