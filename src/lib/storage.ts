import { doc, setDoc, getDoc, getDocs, deleteDoc, collection } from 'firebase/firestore'
import { db } from './firebase'
import type { Survey } from './types'

const COLLECTION = 'surveys'

export const storage = {
  async saveSurvey(survey: Survey): Promise<void> {
    await setDoc(doc(db, COLLECTION, survey.id), {
      ...survey,
      updatedAt: new Date().toISOString(),
    })
  },

  async loadSurvey(id: string): Promise<Survey | null> {
    const snap = await getDoc(doc(db, COLLECTION, id))
    return snap.exists() ? (snap.data() as Survey) : null
  },

  async listSurveys(): Promise<Survey[]> {
    const snap = await getDocs(collection(db, COLLECTION))
    return snap.docs
      .map((d) => d.data() as Survey)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  async deleteSurvey(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id))
  },
}
