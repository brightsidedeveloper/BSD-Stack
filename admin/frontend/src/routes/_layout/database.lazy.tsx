import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/database')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/database"!</div>
}
