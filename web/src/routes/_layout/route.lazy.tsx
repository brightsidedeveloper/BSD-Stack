import { createLazyFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import ez from '../../api/ez'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createLazyFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  const qc = useQueryClient()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="sticky top-0 px-4 py-2 bg-gray-800 border-b flex items-center justify-between border-gray-700 shadow-md text-white">
        <h1 className="font-bold italic text-3xl">BSD-Stack</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              ez.post
                .deleteAccount()
                .then(() => {
                  qc.clear()
                  navigate({ to: '/login' })
                })
                .catch((err) => alert(err.message))
            }}
          >
            Delete ;(
          </button>
          <button
            onClick={() => {
              ez.post
                .logout()
                .then(() => {
                  qc.clear()
                  navigate({ to: '/login' })
                })
                .catch((err) => alert(err.message))
            }}
          >
            Logout :(
          </button>
        </div>
      </header>
      <main className="flex flex-col flex-1">
        <Outlet />
      </main>
    </div>
  )
}
