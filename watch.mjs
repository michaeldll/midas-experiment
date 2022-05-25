import esbuild from "esbuild"
import { sassPlugin } from 'esbuild-sass-plugin'

const port = 1234

console.log(`serving on http://localhost:${port}`)

esbuild.serve({
  port,
  servedir: "public",
}, {
  plugins: [sassPlugin({ type: "style" })],
  entryPoints: ["src/app.ts", "src/scss/global.scss"],
  outdir: "public/built",
  bundle: true
})
