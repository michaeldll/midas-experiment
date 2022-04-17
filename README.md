# hunter-gatherer template

As barebones as I can go. You probably don't want to use this, but feel free to.

Featuring: only 2 dependencies, fast build times and typescript support with esbuild, sass support with `esbuild-sass-plugin `.

## How to develop :

```
npm i
```

then

```
npm run dev
```

This will serve `public/index.html` using built `built/app.js` and `build/scss/global.js` from `/src/app.ts`

Textures, shaders, and all other assets are fetched from the `public` folder.

## How to deploy

```
npm run build
```

to minify files, then deploy the `public` folder.

This essentially uses the same script as the `dev` command, so you don't need to run this build before deploying if you've been developing beforehand.
