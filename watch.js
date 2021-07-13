const esbuild = require('esbuild')
const sassPlugin = require('esbuild-plugin-sass')

esbuild.build({
  entryPoints: ['src/index.mjs'],
  outfile: 'built/out.js',
  bundle: true,
  plugins: [sassPlugin()],
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else console.log('watch build succeeded:', result)
    },
  },
})