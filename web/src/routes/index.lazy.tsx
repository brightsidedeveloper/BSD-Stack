import { createLazyFileRoute } from '@tanstack/react-router'
import App from '../App'

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <App />
}
