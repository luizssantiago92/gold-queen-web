import { describe, expect, it } from 'vitest'

import { LOCALE_STORAGE_KEY, readLocale } from './locale'

describe('readLocale', () => {
  it('stays English when nothing is saved, even if the browser is Portuguese', () => {
    Object.defineProperty(navigator, 'language', {
      configurable: true,
      value: 'pt-BR',
    })

    expect(readLocale()).toBe('en')
  })

  it('uses a saved English or Portuguese choice from settings', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'pt')
    expect(readLocale()).toBe('pt')

    localStorage.setItem(LOCALE_STORAGE_KEY, 'en')
    expect(readLocale()).toBe('en')
  })

  it('ignores a stored value that is not a known locale', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr')
    expect(readLocale()).toBe('en')
  })
})
