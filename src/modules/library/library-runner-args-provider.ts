import { library } from '@/modules/library/library';
import { RunnerController } from '@/modules/runner/runner';
import { RunnerArgsProvider } from '@/modules/runner/runner-args-provider';
import { Bean, getSingleBean } from '@/util/beans';

async function loadLibrary(c: RunnerController, name: string) {
  const lib = await getSingleBean(library, `Library(${name})`);
  return lib.nativeMethods(c);
}

export class LibraryRunnerArgsProvider extends Bean implements RunnerArgsProvider {
  getArgs(c: RunnerController) {
    return {
      loadLibrary(name: string) {
        return loadLibrary(c, name);
      },
    };
  }
}
