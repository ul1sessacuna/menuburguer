import { useState, useEffect } from 'react'
import { subscribeToSettings, DEFAULT_SETTINGS } from '../lib/firebase/settings'

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToSettings((data) => {
      setSettings(data ?? DEFAULT_SETTINGS)
      setLoading(false)
    })
    return unsub
  }, [])

  return { settings, loading }
}
