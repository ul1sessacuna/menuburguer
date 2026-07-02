import { useState, useEffect } from 'react'
import { subscribeToProducts } from '../lib/firebase/products'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToProducts((data) => {
      setProducts(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return { products, loading }
}
