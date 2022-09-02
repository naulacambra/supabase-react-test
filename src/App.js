import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Account from './Account'
import FunctionsList from './FunctionsList'

import './index.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session 
        ? <Auth />
        : 
        <>
          <Account key={session.user.id} session={session} />
          <FunctionsList session={session} />
        </>
      }
    </div>
  )
}