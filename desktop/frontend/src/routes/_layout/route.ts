import { createFileRoute, redirect } from '@tanstack/react-router'
import { createMeQuery } from '../../api/queries'

export const Route = createFileRoute('/_layout')({
  async loader({ context: { queryClient } }) {
    try {
      await queryClient.ensureQueryData(createMeQuery())
    } catch (error) {
      console.error(error)
      return redirect({ to: '/login' })
    }
  },
})
