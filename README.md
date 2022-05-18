# hunter-gatherer boilerplate

As barebones as I can go. You probably don't want to use this boilerplate, but feel free to.

Featuring: 

- Only 2 dependencies : `esbuild` and its' SASS plugin
- Fast build times
- Typescript and SASS support

## How to develop :

```
npm i && npm run dev
```

This will serve `public/index.html` using bundled `public/built/app.js` and `public/built/scss/` from `/src/app.ts` on `localhost:1234`.

Assets need to be fetched from the `public` folder.

This does not output the bundle to disk as it uses `esbuild.serve()` .

## How to deploy

```
npm run build
```

to minify files, then deploy the `public` folder.

This essentially uses the same script as the `dev` command, but runs it just once and actually outputs the bundle to `public/built`.