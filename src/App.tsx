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
      <header style={{ padding: 8, borderBottom: '1px solid #ddd' }}>
        <a href="#/">主ページ</a> | <a href="#/debug">デバッグ</a>
      </header>
      <main style={{ padding: 8 }}>
        {route === '#/' && <Main />}
        {route === '#/debug' && <Debug />}
      </main>
    </div>
  )
}
