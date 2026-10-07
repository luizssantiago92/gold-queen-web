import { useMutation, useQuery, useQueryClient, useQueries } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { useI18n } from '@/i18n/useI18n'
import type { Locale } from '@/i18n/types'

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

const queryKeys = {
  overview: ['overview'] as const,
  categories: ['categories'] as const,
  monthlySeries: ['monthly-series'] as const,
  transactions: (page: number) => ['transactions', page] as const,
  transactionDetail: (id: number) => ['transaction', id] as const,
  connections: ['connections'] as const,
  queenTips: (locale: Locale) => ['queen-tips', locale] as const,
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

/** Pages 2+ load only after `loadMore`. Page 1 keeps the usual refresh. */
export function useTransactionPages(limit = 20) {
  const [pageCount, setPageCount] = useState(1)
  const results = useQueries({
    queries: Array.from({ length: pageCount }, (_, index) => {
      const page = index + 1
      return {
        queryKey: queryKeys.transactions(page),
        queryFn: async () =>
          (
            await api.get<TransactionPage>('/v1/dashboard/transactions', {
              params: { page, limit },
            })
          ).data,
        refetchInterval: page === 1 ? 60_000 : (false as const),
      }
    }),
  })

  const items = results.flatMap((result) => result.data?.items ?? [])
  const total = results[0]?.data?.total
  const first = results[0]
  const later = results.slice(1)
  const laterError = later.some((result) => result.isError && !result.isFetching)
  const isLoadingMore = later.some((result) => result.isFetching && !result.data)
  const hasMore = total !== undefined && items.length < total && !laterError
  const isLoading = !first?.data && Boolean(first?.isPending || first?.isFetching)

  function loadMore() {
    if (!hasMore || isLoadingMore) return
    setPageCount((count) => count + 1)
  }

  function retry() {
    const failed = results.find((result) => result.isError)
    void failed?.refetch()
  }

  return {
    items,
    total,
    hasMore,
    isLoading,
    isError: Boolean(first?.isError && !first.data),
    laterError,
    isLoadingMore,
    loadMore,
    retry,
  }
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

async function refreshTreasury(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.overview }),
    queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
    queryClient.invalidateQueries({ queryKey: queryKeys.monthlySeries }),
    queryClient.invalidateQueries({ queryKey: ['transactions'] }),
    queryClient.invalidateQueries({ queryKey: ['transaction'] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.connections }),
    queryClient.invalidateQueries({ queryKey: ['queen-tips'] }),
  ])
}

export function useConnectToken() {
  return useMutation({
    mutationFn: async () =>
      (await api.post<ConnectTokenResponse>('/v1/connections/connect')).data,
  })
}

export function useSyncConnection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { itemId: string; institutionName?: string }) =>
      (
        await api.post<SyncResponse>('/v1/connections/sync', {
          item_id: input.itemId,
          institution_name: input.institutionName,
        })
      ).data,
    onSuccess: () => refreshTreasury(queryClient),
  })
}

export function useDeleteConnection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (connectionId: number) => {
      await api.delete(`/v1/connections/${connectionId}`)
    },
    onSuccess: () => refreshTreasury(queryClient),
  })
}

/**
 * Queen's Tips costs an AI call, so it is only fetched when the modal opens and
 * is then kept fresh for the session — the backend caches it daily anyway.
 */
export function useQueenTips(enabled: boolean) {
  const { locale } = useI18n()

  return useQuery({
    queryKey: queryKeys.queenTips(locale),
    queryFn: async () =>
      (
        await api.get<QueenTipsResponse>('/v1/advisor/queen-tips', {
          params: { locale },
          timeout: AI_TIMEOUT_MS,
        })
      ).data,
    enabled,
    staleTime: Infinity,
    retry: false,
  })
}

export function useAskQueen() {
  const { locale } = useI18n()

  return useMutation({
    mutationFn: async (question: string) =>
      (
        await api.post<ChatResponse>(
          '/v1/chat/query',
          { question, locale },
          { timeout: AI_TIMEOUT_MS },
        )
      ).data,
  })
}
