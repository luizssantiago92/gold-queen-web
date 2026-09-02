import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { AI_TIMEOUT_MS, api } from './api'
import type {
  BankConnection,
  CategoriesResponse,
  ChatResponse,
  ConnectTokenResponse,
  MonthlySeriesResponse,
  OverviewResponse,
  QueenTipsResponse,
  SyncResponse,
  TransactionPage,
  TransactionDetail,
} from '@/types/api'

export const queryKeys = {
  overview: ['overview'] as const,
  categories: ['categories'] as const,
  monthlySeries: ['monthly-series'] as const,
  transactions: (page: number) => ['transactions', page] as const,
  transactionDetail: (id: number) => ['transaction', id] as const,
  connections: ['connections'] as const,
  queenTips: ['queen-tips'] as const,
}

export function useOverview() {
  return useQuery({
    queryKey: queryKeys.overview,
    queryFn: async () => (await api.get<OverviewResponse>('/v1/dashboard/overview')).data,
    refetchInterval: 60_000,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => (await api.get<CategoriesResponse>('/v1/dashboard/categories')).data,
  })
}

export function useMonthlySeries() {
  return useQuery({
    queryKey: queryKeys.monthlySeries,
    queryFn: async () =>
      (await api.get<MonthlySeriesResponse>('/v1/dashboard/monthly-series')).data,
  })
}

export function useTransactions(page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.transactions(page),
    queryFn: async () =>
      (await api.get<TransactionPage>('/v1/dashboard/transactions', { params: { page, limit } }))
        .data,
    refetchInterval: 60_000,
  })
}

export function useTransactionDetail(transactionId: number | null) {
  return useQuery({
    queryKey: queryKeys.transactionDetail(transactionId ?? 0),
    queryFn: async () =>
      (await api.get<TransactionDetail>(`/v1/dashboard/transactions/${transactionId}`)).data,
    enabled: transactionId !== null,
  })
}

export function useConnections() {
  return useQuery({
    queryKey: queryKeys.connections,
    queryFn: async () => (await api.get<BankConnection[]>('/v1/connections')).data,
  })
}

/**
 * Queen's Tips costs an AI call, so it is only fetched when the modal opens and
 * is then kept fresh for the session — the backend caches it daily anyway.
 */
export function useQueenTips(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.queenTips,
    queryFn: async () =>
      (
        await api.get<QueenTipsResponse>('/v1/advisor/queen-tips', {
          timeout: AI_TIMEOUT_MS,
        })
      ).data,
    enabled,
    staleTime: Infinity,
    retry: false,
  })
}

export function useConnectToken() {
  return useMutation({
    mutationFn: async () =>
      (await api.post<ConnectTokenResponse>('/v1/connections/connect')).data,
  })
}

/** Everything on the dashboard derives from synced data, so invalidate it all. */
export function useSyncConnection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (itemId: string) =>
      (
        await api.post<SyncResponse>(
          '/v1/connections/sync',
          { item_id: itemId },
          { timeout: AI_TIMEOUT_MS },
        )
      ).data,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.overview }),
        queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
        queryClient.invalidateQueries({ queryKey: queryKeys.monthlySeries }),
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.connections }),
        queryClient.invalidateQueries({ queryKey: queryKeys.queenTips }),
      ])
    },
  })
}

export function useAskQueen() {
  return useMutation({
    mutationFn: async (question: string) =>
      (
        await api.post<ChatResponse>(
          '/v1/chat/query',
          { question },
          { timeout: AI_TIMEOUT_MS },
        )
      ).data,
  })
}
