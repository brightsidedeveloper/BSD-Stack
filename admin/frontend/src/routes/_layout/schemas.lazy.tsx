import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/schemas')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/schemas"!</div>
}
