import { createLazyFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">BSD Stack Admin</h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            activeProps={{
              className: 'text-blue-500',
            }}
          >
            Swagger
          </Link>
          <Link
            to="/database"
            activeProps={{
              className: 'text-blue-500',
            }}
          >
            Database
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
