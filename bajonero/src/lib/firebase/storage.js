import { storage } from './config'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

export const uploadImage = async (file, folder = 'products') => {
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export const deleteImage = async (url) => {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch {
    // ignore if already deleted
  }
}
