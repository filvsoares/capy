import { NativeMethodCallback } from '@/modules/parser/method/native-method';
import { declareExtraKey } from '@/util/extra';

export type MethodExtra = {
  nativeMethods: { [name: string]: NativeMethodCallback };
};

export const methodExtraKey = declareExtraKey<MethodExtra>();
