const beanDeclarations: () => Promise<{ declareBeans: () => void }>[] = () => [
  import('@/modules/codegen/_beans'),
  import('@/modules/expression/_beans'),
  import('@/modules/global-variable/_beans'),
  import('@/modules/lib-io/_beans'),
  import('@/modules/library/_beans'),
  import('@/modules/method/_beans'),
  import('@/modules/operation/_beans'),
  import('@/modules/parser/_beans'),
  import('@/modules/runner/_beans'),
  import('@/modules/statement/_beans'),
  import('@/modules/tokenizer/_beans'),
  import('@/modules/type/_beans'),
  import('@/modules/use/_beans'),
];

let declareAllBeansPromise: Promise<void> | undefined;

export function declareAllBeans() {
  if (declareAllBeansPromise) {
    return declareAllBeansPromise;
  }
  return (declareAllBeansPromise = Promise.all(beanDeclarations()).then((imports) =>
    imports.forEach((m) => m.declareBeans())
  ));
}
