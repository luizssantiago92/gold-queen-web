import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

/** Common words that must not come back without pt-BR diacritics. */
const BARE_WORDS = ['nao', 'voce', 'conexoes', 'gratis', 'ate', 'portugues'] as const

describe('pt-BR catalog', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/i18n/pt.ts'), 'utf8')

  it('keeps common words accented', () => {
    const hits = BARE_WORDS.filter((word) => new RegExp(`\\b${word}\\b`, 'i').test(source))
    expect(hits).toEqual([])
  })
})
