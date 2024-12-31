import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/s3')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Roll my own... smh'
}
