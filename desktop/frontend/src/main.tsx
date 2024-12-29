import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
})

const r = createRouter({ routeTree, context: { queryClient: qc } })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof r
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={r} />
    </QueryClientProvider>
  </StrictMode>
)
