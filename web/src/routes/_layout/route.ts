import { createFileRoute, redirect } from '@tanstack/react-router'
import { createV1MeQuery } from '../../api/queries'

export const Route = createFileRoute('/_layout')({
  async loader({ context: { queryClient } }) {
    try {
      await queryClient.ensureQueryData(createV1MeQuery())
    } catch (error) {
      console.error(error)
      return redirect({ to: '/login' })
    }
  },
})
