import { B as Bean } from "./index-DyTq3Mxn.js";
class RunnerImpl extends Bean {
  constructor(runnerArgsProviders) {
    super();
    this.runnerArgsProviders = runnerArgsProviders;
  }
  async run(code, controller) {
    const args = {};
    for (const provider of this.runnerArgsProviders) {
      const argsToAdd = provider.getArgs(controller);
      Object.assign(args, argsToAdd);
    }
    const AsyncFunction = (async function() {
    }).constructor;
    const app = AsyncFunction("args", code);
    await app(args);
  }
}
export {
  RunnerImpl
};
