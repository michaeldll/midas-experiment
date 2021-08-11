const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'public/built/out.js',
  bundle: true,
  sourcemap: true,
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else console.log('watch build succeeded:', result)
    },
  },
})
