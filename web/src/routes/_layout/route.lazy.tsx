import { createLazyFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <header className="sticky top-0 px-4 py-2 bg-gray-800 border-b border-gray-700 shadow-md text-white">
        <h1 className="font-bold italic text-3xl">BSD-Stack</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
