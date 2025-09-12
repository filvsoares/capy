import { declareBeanInterface } from '@/util/beans';

export interface Library {}

export const library = declareBeanInterface<Library>('Library');
