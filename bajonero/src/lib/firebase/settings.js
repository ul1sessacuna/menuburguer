import { db } from './config'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'

const REF = () => doc(db, 'settings', 'config')

export const subscribeToSettings = (callback) =>
  onSnapshot(REF(), (snap) => callback(snap.exists() ? snap.data() : null))

export const updateSettings = (data) =>
  setDoc(REF(), data, { merge: true })

export const DEFAULT_SETTINGS = {
  businessName: 'Bajonero Burger',
  whatsappNumber: '543482565398',
  announcement: '',
  businessHours: {
    lunes:     { open: '18:00', close: '23:30', closed: false },
    martes:    { open: '18:00', close: '23:30', closed: false },
    miercoles: { open: '18:00', close: '23:30', closed: false },
    jueves:    { open: '18:00', close: '23:30', closed: false },
    viernes:   { open: '18:00', close: '00:30', closed: false },
    sabado:    { open: '18:00', close: '00:30', closed: false },
    domingo:   { open: '18:00', close: '23:30', closed: false },
  },
}
