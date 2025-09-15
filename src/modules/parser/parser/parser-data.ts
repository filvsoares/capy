import { ModuleInput } from '@/modules/parser/parser/module-input';
import { Symbol } from '@/modules/parser/parser/symbol';
import { ContextValue } from '@/util/context';

export type ParserData = ContextValue<
  'parserData',
  {
    getInput(moduleName: string): ModuleInput | undefined;
    addInput(input: ModuleInput): void;
    processModule(moduleName: string): void;
    findSymbol(moduleName: string, symbolName: string): Symbol | undefined;
    replaceSymbol(obj: Symbol): void;
    addTask(task: () => void): void;
  }
>;

export function parserData(
  inputs: { [moduleName: string]: ModuleInput },
  modulesToProcess: string[],
  outputs: { [moduleName: string]: { [symbolName: string]: Symbol } },
  tasks: (() => void)[]
): ParserData {
  return {
    parserData: {
      getInput(moduleName) {
        return inputs[moduleName];
      },
      addInput(input) {
        inputs[input.name] = input;
      },
      processModule(moduleName) {
        modulesToProcess.push(moduleName);
      },
      findSymbol(moduleName, symbolName) {
        return outputs[moduleName]?.[symbolName];
      },
      replaceSymbol(obj) {
        outputs[obj.module][obj.name] = obj;
      },
      addTask(task) {
        tasks.push(task);
      },
    },
  };
}
