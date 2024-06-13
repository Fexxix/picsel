"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
const queryClient = new QueryClient()

export function QueryClientProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
