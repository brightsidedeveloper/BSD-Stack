import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/tables')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/tables"!</div>
}
