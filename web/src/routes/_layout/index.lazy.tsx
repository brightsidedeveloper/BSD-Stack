import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { createV1MeQuery } from '../../api/queries'

export const Route = createLazyFileRoute('/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: me } = useQuery(createV1MeQuery())

  return (
    <section className="size-full flex justify-center items-center text-5xl">
      <h3>Welcome, {me?.email}!</h3>
    </section>
  )
}
