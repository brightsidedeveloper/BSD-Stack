import { createFileRoute, redirect } from '@tanstack/react-router'
import { createV1MeQuery } from '../api/queries'

export const Route = createFileRoute('/login')({
  async loader({ context: { queryClient } }) {
    try {
      await queryClient.ensureQueryData(createV1MeQuery())
      return redirect({ to: '/' })
    } catch (error) {
      console.error(error)
    }
  },
})
