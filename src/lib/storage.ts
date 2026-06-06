import { doc, setDoc, getDoc, getDocs, deleteDoc, collection, query, where } from 'firebase/firestore'
import { db } from './firebase'
import type { Survey, SurveyResponse } from './types'

const COLLECTION = 'surveys'
const RESPONSES_COLLECTION = 'responses'

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

  // ── Survey responses ────────────────────────────────────────
  // Document ID is surveyId_sessionToken — upsert semantics so re-submitting
  // the same session overwrites rather than duplicates.

  async saveResponse(response: SurveyResponse): Promise<void> {
    await setDoc(doc(db, RESPONSES_COLLECTION, response.id), response)
  },

  async loadResponses(surveyId: string): Promise<SurveyResponse[]> {
    const q = query(
      collection(db, RESPONSES_COLLECTION),
      where('surveyId', '==', surveyId),
    )
    const snap = await getDocs(q)
    return snap.docs
      .map((d) => d.data() as SurveyResponse)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  },
}
