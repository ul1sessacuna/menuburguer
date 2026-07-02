import { db } from './config'
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'

const COL = 'products'

export const subscribeToProducts = (callback) => {
  const q = query(collection(db, COL), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

export const addProduct = (data) =>
  addDoc(collection(db, COL), {
    ...data,
    available: true,
    order: 999,
    createdAt: serverTimestamp(),
  })

export const updateProduct = (id, data) =>
  updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() })

export const deleteProduct = (id) =>
  deleteDoc(doc(db, COL, id))

export const toggleAvailability = (id, available) =>
  updateDoc(doc(db, COL, id), { available })
