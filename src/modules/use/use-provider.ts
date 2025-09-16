import { OptionalPromise } from '@/base';
import { ToplevelReaderContext } from '@/modules/parser/toplevel-reader';
import { declareBeanInterface } from '@/util/beans';

export interface UseProvider {
  processUse(s: string, c: ToplevelReaderContext): OptionalPromise<string | undefined>;
}

export const useProvider = declareBeanInterface<UseProvider>('UseProvider');
