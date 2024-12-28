import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createV1HealthQuery, createV1UsersQuery } from './api/queries'
import ez from './api/ez'

export default function App() {
  const qc = useQueryClient()
  const { data } = useQuery(createV1UsersQuery())
  const { data: d2 } = useQuery(createV1HealthQuery({ awesome: true }))

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <div className="[&_p]:text-xl flex flex-col gap-4">
      <p>React Version: {React.version}</p>
      <p>{d2?.status}</p>
      <ul>
        {data?.users?.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button
        onClick={() =>
          ez.post
            .v1Signup({
              email,
              password,
            })
            .then(({ token }) => {
              alert(`User created with session: ${token}`)
              qc.invalidateQueries(createV1UsersQuery())
            })
            .catch((e) => {
              console.log(e)
              alert(e.message)
            })
        }
      >
        Create Account
      </button>
      <button
        onClick={() =>
          ez.post
            .v1Login({
              email,
              password,
            })
            .then(({ token }) => {
              alert(`User logged in with session: ${token}`)
              qc.invalidateQueries(createV1UsersQuery())
            })
            .catch((e) => {
              console.log(e)
              alert(e.message)
            })
        }
      >
        Login Account
      </button>
    </div>
  )
}
