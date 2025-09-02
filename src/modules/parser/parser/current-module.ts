import { ContextValue } from '@/util/context';

export type CurrentModule = ContextValue<'currentModule', string>;

export function currentModule(name: string): CurrentModule {
  return { currentModule: name };
}
