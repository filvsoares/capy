import { declareBeanInterface } from '@/util/beans';

export interface RunnerController {
  createTab(title: string, content: HTMLElement): void;
}

export interface Runner {
  run(code: string, c: RunnerController): Promise<void>;
}

export const runner = declareBeanInterface<Runner>('Runner');
