const beanDeclarations: () => Promise<{ declareBeans: () => void }>[] = () => [
  // codegen
  import('@/modules/codegen/codegen/_beans'),
  import('@/modules/codegen/global-variable/_beans'),
  import('@/modules/codegen/method/_beans'),
  // parser
  import('@/modules/parser/expression/_beans'),
  import('@/modules/parser/global-variable/_beans'),
  import('@/modules/parser/impexp/_beans'),
  import('@/modules/parser/method/_beans'),
  import('@/modules/parser/operation/_beans'),
  import('@/modules/parser/parser/_beans'),
  import('@/modules/parser/statement/_beans'),
  import('@/modules/parser/tokenizer/_beans'),
  import('@/modules/parser/type/_beans'),
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
