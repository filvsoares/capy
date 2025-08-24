import { Base } from '@/base';

export const INVALID = Symbol();
export type Invalid = typeof INVALID;

export abstract class L3Base extends Base {
  isL3() {
    return true;
  }
}
