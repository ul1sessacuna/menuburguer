import { useState, useEffect } from 'react'
import { subscribeToOrders } from '../lib/firebase/orders'

export const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToOrders((data) => {
      setOrders(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return { orders, loading }
}
