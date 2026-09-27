import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

function headerMap(): Record<string, string> {
  const config = JSON.parse(readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8')) as {
    headers: { headers: { key: string; value: string }[] }[]
  }
  return Object.fromEntries(config.headers[0].headers.map((header) => [header.key, header.value]))
}

describe('production security headers', () => {
  const headers = headerMap()

  it('sets the browser hardening headers from the audit', () => {
    expect(headers['X-Content-Type-Options']).toBe('nosniff')
    expect(headers['X-Frame-Options']).toBe('DENY')
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['Permissions-Policy']).toContain('camera=()')
    expect(headers['Permissions-Policy']).toContain('microphone=()')
    expect(headers['Permissions-Policy']).toContain('geolocation=()')
  })

  it('allows the API, Google Fonts, and same-origin images without inline scripts', () => {
    const csp = headers['Content-Security-Policy']

    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("script-src 'self'")
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'")
    expect(csp).not.toContain('unsafe-eval')
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain('https://gold-queen-api.onrender.com')
    expect(csp).toContain('https://fonts.googleapis.com')
    expect(csp).toContain('https://fonts.gstatic.com')
    expect(csp).toContain("img-src 'self'")
    expect(csp).toContain("style-src-attr 'unsafe-inline'")
  })
})
