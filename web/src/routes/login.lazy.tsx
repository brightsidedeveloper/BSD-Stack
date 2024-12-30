import { createLazyFileRoute } from '@tanstack/react-router'
import App from '../App'

export const Route = createLazyFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <App />
}
