import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

const TOKEN_KEY = 'gold-queen.token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000',
  // The demo backend runs on a free tier that spins down after a few idle
  // minutes and takes upwards of 50s to boot, so a shorter timeout would abort
  // the first request of every session.
  timeout: 90_000,
})

/**
 * Endpoints that hit Gemini answer in tens of seconds, and the backend already
 * retries transient upstream failures. The default timeout would abort those
 * requests before the model ever replies.
 */
export const AI_TIMEOUT_MS = 120_000

export function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

api.interceptors.request.use((config) => {
  const token = readToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** Fired on any 401 so the AuthProvider can drop the session without a hard reload. */
export const UNAUTHORIZED_EVENT = 'gold-queen:unauthorized'

const MAX_RETRIES = 2
const RETRY_DELAY_MS = 4_000

type RetriableConfig = InternalAxiosRequestConfig & { retryCount?: number }

/**
 * While the free-tier instance boots, Render's edge answers with no CORS headers,
 * which the browser surfaces as a network error rather than a status code. Those
 * are worth retrying: the instance is usually up by the second attempt.
 *
 * Restricted to requests that are safe to repeat. A blind retry could burn a
 * second Gemini call and another token from the user's daily chat quota.
 */
function isSafeToRetry(config: RetriableConfig | undefined): boolean {
  if (!config) return false
  const method = (config.method ?? 'get').toLowerCase()
  return method === 'get' || config.url === '/v1/auth/login'
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
      return Promise.reject(error)
    }

    const config = error.config as RetriableConfig | undefined
    const noAnswer = !error.response || error.code === 'ECONNABORTED'
    const attempts = config?.retryCount ?? 0

    if (noAnswer && attempts < MAX_RETRIES && isSafeToRetry(config)) {
      config!.retryCount = attempts + 1
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
      return api.request(config!)
    }

    return Promise.reject(error)
  },
)

/** The API always answers errors as `{ "detail": "..." }`. */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail
    if (typeof detail === 'string' && detail.length > 0) {
      return detail
    }
    // Both cases mean the server never answered. On the free tier that is almost
    // always the instance waking up, so the copy points at retrying rather than
    // implying the app is broken.
    if (error.code === 'ECONNABORTED' || !error.response) {
      return 'Os guardas do castelo ainda despertam. Aguardai um instante e tentai novamente.'
    }
  }
  return fallback
}

export function statusOf(error: unknown): number | undefined {
  return error instanceof AxiosError ? error.response?.status : undefined
}
