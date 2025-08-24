import { Base } from '@/base';

/**
 * Base class for L1 objects.
 */
export abstract class L1Base extends Base {
  /**
   * Method to enforce TypeScript nominal typing.
   */
  isL1Base() {
    return true;
  }
}
