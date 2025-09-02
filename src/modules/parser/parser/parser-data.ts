import { ModuleInput } from '@/modules/parser/parser/module-input';
import { Symbol } from '@/modules/parser/parser/symbol';
import { ContextValue } from '@/util/context';

export type ParserData = ContextValue<
  'parserData',
  {
    mainModuleName: string;
    getInput(moduleName: string): ModuleInput | undefined;
    getOutput(moduleName: string): { [symbolName: string]: Symbol } | undefined;
    putOutput(moduleName: string, symbols: { [symbolName: string]: Symbol }): void;
    addTask(task: () => void): void;
  }
>;

export function parserData(
  mainModuleName: string,
  inputs: { [moduleName: string]: ModuleInput },
  outputs: { [moduleName: string]: { [symbolName: string]: Symbol } },
  tasks: (() => void)[]
): ParserData {
  return {
    parserData: {
      mainModuleName,
      getInput(moduleName: string): ModuleInput | undefined {
        return inputs[moduleName];
      },
      getOutput(moduleName: string): { [symbolName: string]: Symbol } | undefined {
        return outputs[moduleName];
      },
      putOutput(moduleName: string, symbols: { [symbolName: string]: Symbol }) {
        outputs[moduleName] = symbols;
      },
      addTask(task) {
        tasks.push(task);
      },
    },
  };
}
