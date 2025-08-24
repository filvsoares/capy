import { L3Base } from '@/beans/l3-parser/l3-base';

export type L3PrimitiveType = 'string' | 'number' | 'boolean' | 'void';

export abstract class L3Type extends L3Base {}
