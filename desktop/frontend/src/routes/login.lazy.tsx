import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import ez from '../api/ez'
import { ShowAlert } from '../../wailsjs/go/main/App'

export const Route = createLazyFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const [emailText, setEmailText] = useState('')
  const [passwordText, setPasswordText] = useState('')

  const [isCreateAccount, setIsCreateAccount] = useState(false)

  return (
    <main className="flex flex-col items-center justify-center min-h-dvh flex-1">
      <h1 className="text-5xl font-extrabold mb-32">BSD-Stack</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()

          if (isCreateAccount) {
            ez.post
              .signup({ email: emailText, password: passwordText })
              .then(() => {
                navigate({ to: '/' })
              })
              .catch((err) => {
                ShowAlert(err.message)
              })
            return
          }

          ez.post
            .login({ email: emailText, password: passwordText })
            .then(() => {
              navigate({ to: '/' })
            })
            .catch((err) => {
              ShowAlert(err.message)
            })
        }}
        className="border rounded-lg shadow-lg p-4 mt-4 max-w-md w-full"
      >
        <h1 className="text-4xl font-bold mb-4">{isCreateAccount ? 'Create' : 'Login'}</h1>
        <div className="[&_input]:text-gray-900">
          <input
            type="email"
            className="border border-gray-200 rounded-lg p-2 w-full"
            placeholder="Email"
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
          />
          <input
            type="password"
            className="border border-gray-200 rounded-lg p-2 w-full mt-4"
            placeholder="Password"
            value={passwordText}
            onChange={(e) => setPasswordText(e.target.value)}
          />
        </div>
        <button className="bg-blue-500 text-white rounded-lg p-2 w-full mt-4" onClick={() => {}}>
          {isCreateAccount ? 'Create' : 'Login'}
        </button>

        <button type="button" className="text-blue-500 mt-4" onClick={() => setIsCreateAccount(!isCreateAccount)}>
          {isCreateAccount ? 'Login' : 'Create'}
        </button>
      </form>
    </main>
  )
}
