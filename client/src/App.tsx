import { Bright } from 'bright'
import React, { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    Bright.get.healthCheck().then((response) => {
      console.log(response)
    })
  }, [])

  return <div>{React.version}</div>
}
