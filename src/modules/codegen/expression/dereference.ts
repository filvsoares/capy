import { Context, ContextValue } from '@/util/context';

export type Dereference = ContextValue<'dereference', true>;

export function dereference(): Dereference {
  return { dereference: true };
}

export function hasDereference(c: Context<Partial<Dereference>>): c is Context<Dereference> {
  return c.dereference === true;
}
