import esbuild from "esbuild"
import { sassPlugin } from 'esbuild-sass-plugin'

esbuild.serve({
  port: 1234,
  servedir: "public",
}, {
  plugins: [sassPlugin({ type: "style" })],
  entryPoints: ["src/app.ts", "src/scss/global.scss"],
  outdir: "public/built",
  bundle: true
})
