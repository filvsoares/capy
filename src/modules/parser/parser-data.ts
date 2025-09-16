import { ModuleInput } from '@/modules/parser/module-input';
import { Symbol } from '@/modules/parser/symbol';

export class ParserData {
  constructor(
    private inputs: { [moduleName: string]: ModuleInput },
    private modulesToProcess: string[],
    private outputs: { [moduleName: string]: { [symbolName: string]: Symbol } },
    private tasks: (() => void)[]
  ) {}

  getInput(moduleName: string): ModuleInput | undefined {
    return this.inputs[moduleName];
  }

  addInput(input: ModuleInput): void {
    this.inputs[input.name] = input;
  }

  processModule(moduleName: string): void {
    this.modulesToProcess.push(moduleName);
  }

  findSymbol(moduleName: string, symbolName: string): Symbol | undefined {
    return this.outputs[moduleName]?.[symbolName];
  }

  replaceSymbol(obj: Symbol): void {
    this.outputs[obj.module][obj.name] = obj;
  }

  addTask(task: () => void): void {
    this.tasks.push(task);
  }
}
