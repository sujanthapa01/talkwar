'use client'

import { useEffect } from 'react'
import axios from 'axios'
import { useSessionContext } from '@/context/sessionContext'

export default function UpsertUserOnLoad() {
  const { user } = useSessionContext()

  useEffect(() => {
    const syncUser = async () => {
      if (user) {
        try {
          await axios.post('/api/upsert-user', {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || "Unknown",
          })
          console.log('User upserted successfully')
        } catch (err) {
          console.error('Failed to upsert user:', err)
        }
      }
    }

    syncUser()
  }, [user]) 

  return null
}
