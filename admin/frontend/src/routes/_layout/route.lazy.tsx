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
          {routes.map((route) => (
            <Link
              {...route}
              activeProps={{
                className: 'text-blue-500',
              }}
            />
          ))}
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

const routes = [
  { to: '/', children: 'Dashboard' },
  { to: '/api', children: 'Swagger API' },
  { to: '/tables', children: 'Tables' },
  { to: '/migrations', children: 'Migrations' },
  { to: '/s3', children: 'S3' },
] as const
