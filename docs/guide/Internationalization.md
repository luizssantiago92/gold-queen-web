# Internationalization

Gold Queen Web supports **English** and **Portuguese (Brazil)**. English is the default; Portuguese is opt-in via toggle or browser detection.

---

## Locale resolution

`readLocale()` in `src/i18n/locale.ts`:

```text
1. localStorage gold-queen.locale → if "en" or "pt", use it
2. navigator.language starts with "pt" → "pt"
3. otherwise → "en"
```

`I18nProvider` persists changes when the user picks a language in `LanguageToggle`.

| Storage key | Purpose |
| --- | --- |
| `gold-queen.locale` | User preference (`en` \| `pt`) |

---

## UI catalogs

| File | Role |
| --- | --- |
| `src/i18n/en.ts` | English strings (source of key types) |
| `src/i18n/pt.ts` | Portuguese strings (`Messages` type from `en`) |
| `src/i18n/context.tsx` | `useI18n()`, `t(key, vars?)`, `document.lang` + `title` |
| `src/i18n/types.ts` | `Locale` union |

**Rule:** every new user-facing key must exist in **both** catalogs.

### Usage

```tsx
const { locale, setLocale, t } = useI18n()
return <p>{t('balanceTitle')}</p>
```

Interpolation: `{{count}}` placeholders in catalog strings.

---

## Language toggle

`LanguageToggle` — shared component on:

- `LoginScreen` (top of screen)
- `ProfileScreen` (inside Language card)

Do not duplicate ad-hoc EN/PT buttons elsewhere.

---

## Formatting

`src/lib/localeFormat.ts` and `src/lib/format.ts`:

| Function | Locale behavior |
| --- | --- |
| `formatMoney` | `en-US` vs `pt-BR` grouping; currency stays **BRL** |
| `formatDay` | Short date per locale |
| `formatReferenceMonth` | Month label on home header |
| `categoryLabel` | Maps API category codes to localized labels |

Default `formatMoney` locale is `en` when omitted.

---

## API integration

### Accept-Language

Every Axios request sets:

| Locale | Header |
| --- | --- |
| `en` | `en-US,en;q=0.9` |
| `pt` | `pt-BR,pt;q=0.9,en;q=0.8` |

Implemented in `api.ts` request interceptor via `acceptLanguageHeader()`.

### Explicit locale on AI routes

| Endpoint | Parameter |
| --- | --- |
| `GET /v1/advisor/queen-tips` | `?locale=en` or `?locale=pt` |
| `POST /v1/chat/query` | JSON body `{ question, locale }` |

Hooks read `locale` from `useI18n()` so switching language affects the next AI call.

---

## HTML document

| Source | Behavior |
| --- | --- |
| `index.html` | Static `lang="en"` and English title (first paint) |
| `I18nProvider` effect | Updates `document.documentElement.lang` and `document.title` when locale changes |

---

## Testing checklist

1. Fresh browser (no `localStorage`) on non-PT system → English UI
2. Browser `pt-BR` with no storage → Portuguese UI
3. Toggle on Login → persists after login
4. Toggle on Profile → dashboard copy and formats update
5. Queen's Tips and chat return Portuguese when `locale=pt`

Back to [guide index](README.md)
