import React, { useEffect, useState } from 'react'
import Main from './pages/Main'
import Debug from './pages/Debug'

export default function App(): JSX.Element {
  const [route, setRoute] = useState<string>(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <div>
      <main>
        {route === '#/' && <Main />}
        {route === '#/debug' && <Debug />}
      </main>
    </div>
  )
}
