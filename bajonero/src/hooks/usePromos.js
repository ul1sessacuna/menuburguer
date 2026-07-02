import { useState, useEffect } from 'react'
import { subscribeToPromos } from '../lib/firebase/promos'

export const usePromos = () => {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToPromos((data) => {
      setPromos(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return { promos, loading }
}
