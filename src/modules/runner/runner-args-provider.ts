import { RunnerController } from '@/modules/runner/runner';
import { declareBeanInterface } from '@/util/beans';

export interface RunnerArgsProvider {
  getArgs(c: RunnerController): {};
}

export const runnerArgsProvider = declareBeanInterface<RunnerArgsProvider>('RunnerArgsProvider');
