export type Locale = 'en' | 'pt'

export type TranslationKey = keyof typeof import('./en').en
