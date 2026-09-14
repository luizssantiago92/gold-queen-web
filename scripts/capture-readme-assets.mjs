import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { execSync } from 'node:child_process'

const BASE = process.env.APP_URL ?? 'https://gold-queen-web.vercel.app'
const OUT = 'docs/assets'

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2,
})
const page = await context.newPage()

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/login.png` })

await page.getByRole('button', { name: 'Sign in' }).click()
await page.getByText('Pluggy Bank', { exact: false }).waitFor({ timeout: 120_000 })
await page.waitForTimeout(1000)
await page.screenshot({ path: `${OUT}/dashboard.png` })

await browser.close()

execSync(
  `ffmpeg -y -loop 1 -t 2.5 -i ${OUT}/login.png -loop 1 -t 3 -i ${OUT}/dashboard.png -filter_complex "[0:v]scale=412:915:force_original_aspect_ratio=decrease,pad=412:915:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=10[v0];[1:v]scale=412:915:force_original_aspect_ratio=decrease,pad=412:915:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=10[v1];[v0][v1]concat=n=2:v=1:a=0,format=rgb24,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" ${OUT}/demo.gif`,
  { stdio: 'inherit' },
)

console.log(`Saved assets from ${BASE}`)
