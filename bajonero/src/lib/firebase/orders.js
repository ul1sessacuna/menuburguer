import { db } from './config'
import {
  collection, doc, addDoc, updateDoc,
  onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'

const COL = 'orders'

export const subscribeToOrders = (callback) => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export const subscribeToOrder = (id, callback) =>
  onSnapshot(doc(db, COL, id), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  })

export const createOrder = (data) =>
  addDoc(collection(db, COL), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  })

export const updateOrderStatus = (id, status) =>
  updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() })
