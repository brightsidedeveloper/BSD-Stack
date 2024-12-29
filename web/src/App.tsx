import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createV1HealthQuery, createV1UsersQuery } from './api/queries'
import ez from './api/ez'

export default function App() {
  const qc = useQueryClient()
  const { data } = useQuery(createV1UsersQuery())
  const { data: d2, error, refetch } = useQuery(createV1HealthQuery({}))

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <div className="[&_p]:text-xl flex flex-col gap-4">
      <p>React Version: {React.version}</p>

      <ul>
        {data?.users?.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
      {error ? (
        <div className="mx-auto flex flex-col gap-4 [&_input]:border [&_input]:p-2 [&_input]:rounded-xl max-w-64 p-4 px-6 border rounded-xl ">
          <h3 className="text-xl py-2 text-center">GO Fire no cap</h3>
          <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            onClick={() =>
              ez.post
                .v1Signup({
                  email,
                  password,
                })
                .then(() => {
                  qc.invalidateQueries(createV1UsersQuery())
                  refetch()
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
                .then(() => refetch())
                .catch((e) => {
                  console.log(e)
                  alert(e.message)
                })
            }
          >
            Login Account
          </button>
        </div>
      ) : d2?.status ? (
        <div className="w-fit mx-auto flex flex-col items-center gap-4">
          <button className="w-fit" onClick={() => ez.post.v1Logout().then(() => refetch())}>
            Logout
          </button>
          <button
            className="w-fit"
            onClick={() =>
              ez.post.v1DeleteAccount().then(() => {
                refetch()
                qc.invalidateQueries(createV1UsersQuery())
              })
            }
          >
            Delete Account
          </button>
        </div>
      ) : null}
    </div>
  )
}
