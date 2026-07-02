import { db } from './config'
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'

const COL = 'promos'

export const subscribeToPromos = (callback) => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

export const addPromo = (data) =>
  addDoc(collection(db, COL), {
    ...data,
    active: true,
    createdAt: serverTimestamp(),
  })

export const updatePromo = (id, data) =>
  updateDoc(doc(db, COL, id), data)

export const deletePromo = (id) =>
  deleteDoc(doc(db, COL, id))
