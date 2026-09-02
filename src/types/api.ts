/**
 * Mirrors the response models of gold-queen-api (`/openapi.json`).
 *
 * Monetary values arrive as strings because the API serialises `Decimal`, which
 * keeps cents exact. Parse them with `toNumber` from `lib/format` only at the
 * point of rendering or charting, never for storage.
 */

export interface User {
  id: number
  email: string
  display_name: string
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in_minutes: number
}

export interface BankConnection {
  id: number
  pluggy_item_id: string
  institution_name: string
  status: string
  last_synced_at: string | null
}

export interface ConnectTokenResponse {
  connect_token: string
  expires_in_minutes: number
  connections_used: number
  connections_limit: number
}

export interface SyncResponse {
  connection: BankConnection
  accounts_synced: number
  transactions_synced: number
  transactions_categorized: number
  guarded: boolean
}

export interface BankBalance {
  connection_id: number
  institution_name: string
  balance: string
  share_percentage: number
}

export interface OverviewResponse {
  total_balance: string
  currency: string
  banks: BankBalance[]
  month_expenses: string
  month_income: string
  reference_month: string
}

export interface CategoryBreakdown {
  category: string
  total: string
  share_percentage: number
  transaction_count: number
}

export interface CategoriesResponse {
  reference_month: string
  total_expenses: string
  categories: CategoryBreakdown[]
}

export interface MonthlySeriesPoint {
  date: string
  cumulative_expenses: string
}

export interface MonthlySeriesResponse {
  reference_month: string
  total_expenses: string
  points: MonthlySeriesPoint[]
}

export interface Transaction {
  id: number
  description: string
  amount: string
  transaction_date: string
  category: string
  display_category: string
  is_guarded: boolean
  institution_name: string
  account_name: string
}

export interface TransactionDetail extends Transaction {
  account_type: string
  created_at: string
}

export interface TransactionPage {
  items: Transaction[]
  page: number
  limit: number
  total: number
}

export interface QueenTipsResponse {
  critical_expense: string
  management_status: string
  smart_guidance: string
  is_guarded: boolean
  from_cache: boolean
}

export interface ChatResponse {
  answer: string
  from_cache: boolean
  remaining_requests: number
  daily_limit: number
}
