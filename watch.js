const esbuild = require('esbuild')
const http = require('http');
const static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
const file = new static.Server('./public');
const hostname = '127.0.0.1';
const port = 4321;

const getNewServer = () => http.createServer(function (request, response) {
  request.addListener('end', () => {
    file.serve(request, response);
  }).resume();
}).listen(port, hostname);

let server = getNewServer()

console.log(`Server running at http://${hostname}:${port}/`);

// Build files and watch for changes
const restartServer = () => {
  server.close(() => {
    delete require.cache['public/built/out.js'];
    server = getNewServer()
    console.log(`Restarted server`);
  })
}

esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'public/built/out.js',
  bundle: true,
  sourcemap: true,
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else {
        console.log('watch build succeeded:', result)
        console.log('last build: ', new Date().getMinutes(), 'm', new Date().getSeconds(), 's', new Date().getMilliseconds(), 'ms')
        // restartServer()
      }
    },
  },
})
