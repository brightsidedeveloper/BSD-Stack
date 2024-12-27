import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { createV1HealthQuery, createV1UsersQuery } from './api/queries'
import ez from './api/ez'

export default function App() {
  const { data } = useQuery(createV1UsersQuery())
  const { data: d2 } = useQuery(createV1HealthQuery({ awesome: true }))

  return (
    <div className="[&_p]:text-xl flex flex-col gap-4">
      <p>React Version: {React.version}</p>
      <p>{d2?.status}</p>
      <ul>
        {data?.users?.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
      <button
        onClick={() =>
          ez.post
            .v1Health({
              health: Math.floor(Math.random() * 100),
            })
            .then((res) => alert(res.status))
        }
      >
        Submit Health
      </button>
    </div>
  )
}
