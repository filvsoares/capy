import madge from 'madge';

madge('src/index.tsx', { tsConfig: 'tsconfig.json' })
  .then((res) => res.image('out.svg'))
  .then((writtenImagePath) => {
    console.log('Image written to ' + writtenImagePath);
  });
