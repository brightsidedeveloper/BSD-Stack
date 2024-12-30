import { useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { createMeQuery } from '../../api/queries'

export const Route = createLazyFileRoute('/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: me } = useSuspenseQuery(createMeQuery())

  return (
    <section className="size-full flex flex-1 justify-center items-center text-5xl">
      <h3 className="text-center font-black leading-relaxed">
        Welcome to BSD,
        <br /> {me.email}!
      </h3>
    </section>
  )
}
