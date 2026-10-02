/** Public demo credentials, also printed in the README and prefilled on the login form. */
export const DEMO_EMAIL = 'queen@goldqueen.dev'
export const DEMO_PASSWORD = 'QueenDemo123!'

/**
 * Fixed pt-BR copy for the production demo gates. The API answers these 403s
 * in English (`detail`), which is the wrong voice for a visitor who just tried
 * to sign up or change the shared treasury.
 */
export const SIGNUP_CLOSED_MESSAGE =
  `O cadastro está fechado nesta demonstração. Entre com a conta demo já preenchida: ${DEMO_EMAIL} / ${DEMO_PASSWORD}.`

export const DEMO_READ_ONLY_MESSAGE = 'A conta demo é somente leitura.'
