import { Runner, RunnerController } from '@/modules/runner/runner';
import { RunnerArgsProvider } from '@/modules/runner/runner-args-provider';
import { Bean } from '@/util/beans';

export class RunnerImpl extends Bean implements Runner {
  constructor(private runnerArgsProviders: RunnerArgsProvider[]) {
    super();
  }

  async run(code: string, controller: RunnerController): Promise<void> {
    const args = {};
    for (const provider of this.runnerArgsProviders) {
      const argsToAdd = provider.getArgs(controller);
      Object.assign(args, argsToAdd);
    }

    const AsyncFunction = async function () {}.constructor;
    const app = AsyncFunction('args', code);
    try {
      await app(args);
    } catch (err: any) {
      console.error(err);
    }
  }
}
