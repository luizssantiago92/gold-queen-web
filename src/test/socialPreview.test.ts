import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const SITE = 'https://gold-queen-web.vercel.app'
const IMAGE = `${SITE}/og-image.webp`

function webpSize(buffer: Buffer): { width: number; height: number } {
  if (buffer.subarray(0, 4).toString('ascii') !== 'RIFF') {
    throw new Error('preview image is not a RIFF file')
  }
  if (buffer.subarray(8, 12).toString('ascii') !== 'WEBP') {
    throw new Error('preview image is not WebP')
  }
  if (buffer.subarray(12, 16).toString('ascii') !== 'VP8 ') {
    throw new Error('preview image is not a lossy WebP keyframe')
  }
  const payload = buffer.subarray(20)
  if (payload.subarray(3, 6).toString('hex') !== '9d012a') {
    throw new Error('preview image is missing the VP8 keyframe header')
  }
  return {
    width: payload.readUInt16LE(6) & 0x3fff,
    height: payload.readUInt16LE(8) & 0x3fff,
  }
}

describe('social preview', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')

  it('publishes Portuguese Open Graph and Twitter card tags', () => {
    expect(html).toContain('<title>Gold Queen — Tesouro real e portfólio backend</title>')
    expect(html).toContain('name="description"')
    expect(html).toContain('Portfólio de Luiz Santiago para estágio em backend.')
    expect(html).toContain('name="theme-color" content="#0D0D0E"')
    expect(html).toContain(`rel="canonical" href="${SITE}/"`)
    expect(html).toContain('property="og:title" content="Gold Queen — Tesouro real e portfólio backend"')
    expect(html).toContain('property="og:description"')
    expect(html).toContain(`property="og:url" content="${SITE}/"`)
    expect(html).toContain('property="og:type" content="website"')
    expect(html).toContain(`property="og:image" content="${IMAGE}"`)
    expect(html).toContain('property="og:locale" content="pt_BR"')
    expect(html).toContain('name="twitter:card" content="summary_large_image"')
    expect(html).toContain(`name="twitter:image" content="${IMAGE}"`)
  })

  it('ships a light 1200x630 preview derived for sharing', () => {
    const image = readFileSync(resolve(process.cwd(), 'public/og-image.webp'))
    expect(image.byteLength).toBeLessThan(150 * 1024)
    expect(webpSize(image)).toEqual({ width: 1200, height: 630 })
  })
})
