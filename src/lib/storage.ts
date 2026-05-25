import type { Survey } from './types'

const store = new Map<string, Survey>()

export const storage = {
  async saveSurvey(survey: Survey): Promise<void> {
    store.set(survey.id, { ...survey, updatedAt: new Date().toISOString() })
  },

  async loadSurvey(id: string): Promise<Survey | null> {
    return store.get(id) ?? null
  },

  async listSurveys(): Promise<Survey[]> {
    return Array.from(store.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  },

  async deleteSurvey(id: string): Promise<void> {
    store.delete(id)
  },
}
