import Main from './Main.tsx'
import LogIn from './Login.tsx'
import { auth } from '../../server/firebase.ts'
import { useEffect, useState } from 'react'

export default function Project() {
  const [user, setUser] = useState(auth.currentUser)
  const [loaded, setLoaded] = useState(false)

  const url = new URL(window.location.href)
  const id = url.searchParams.get('id')

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user || null)
      setLoaded(true)
    })
  }, [])

  return <>{loaded &&
    (user || id ? (
      <Main user={user} id={id} signOut={() => auth.signOut()} />
    ) : (
      <LogIn setUser={setUser} />
    ))}</>
}