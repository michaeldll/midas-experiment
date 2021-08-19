# hunter-gatherer template

As barebones as I can go. You probably don't want to use this.

## How to develop :
```
npm i
```
then
```
npm run watch
``` 

This will serve `public/index.html` using built `built/out.js` from `/src/index.ts`

Textures, shaders, and all other assets are fetched from the `public` folder.

## How to deploy

```npm run build``` 

to minify files, then deploy the `public` folder.
