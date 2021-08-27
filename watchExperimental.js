const esbuild = require('esbuild')
const http = require('http');
const static = require('node-static');
const sass = require('sass');
const { promisify } = require("util");
const { writeFile } = require("fs");
const keypress = require('keypress');


// Create a node-static server instance to serve the './public' folder
const file = new static.Server('./public');
const hostname = '127.0.0.1';
const port = 4321;

const getNewServer = () => http.createServer(function (request, response) {
  request.addListener('end', () => {
    file.serve(request, response);
  }).resume();
}).listen(port, hostname);

getNewServer()

console.log(`Server running at http://${hostname}:${port}/`);

// Build files and watch for changes
async function compileSass() {
  const sassRenderPromise = promisify(sass.render);
  const writeFilePromise = promisify(writeFile);

  const styleResult = await sassRenderPromise({
    file: `${process.cwd()}/src/scss/global.scss`,
    outFile: `${process.cwd()}/public/built/index.css`,
  })

  await writeFilePromise(`${process.cwd()}/public/built/index.css`, styleResult.css, "utf8");
}


esbuild.build({
  entryPoints: [
    'src/index.ts',
  ],
  outdir: 'public/built/',
  bundle: true,
  sourcemap: true,
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else {
        compileSass()
        console.log('watch build succeeded:', result)
        console.log('last build: ', new Date().getHours(), 'h', new Date().getMinutes(), 'm', new Date().getSeconds(), 's', new Date().getMilliseconds(), 'ms')
      }
    },
  },
})

// Make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// Listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name == "s") {
    compileSass()
    esbuild.build({
      entryPoints: [
        'src/index.ts',
      ],
      outdir: 'public/built/',
      bundle: true,
      sourcemap: true,
    })
  }
  if (key && key.ctrl && key.name == 'c') {
    process.exit()
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

// const restartServer = () => {
//   server.close(() => {
//     delete require.cache['public/built/out.js'];
//     server = getNewServer()
//     console.log(`Restarted server`);
//   })c
// }
