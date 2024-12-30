import { createFileRoute, redirect } from '@tanstack/react-router'
import { createMeQuery } from '../api/queries'

export const Route = createFileRoute('/login')({
  async loader({ context: { queryClient } }) {
    try {
      await queryClient.ensureQueryData(createMeQuery())
      return redirect({ to: '/' })
    } catch (error) {
      console.error(error)
    }
  },
})
