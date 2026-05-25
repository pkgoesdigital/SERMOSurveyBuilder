// src/data/surveys/index.ts

import type { Survey } from '../../lib/types'
import sampleSurvey from './sample_biosimilar_survey.json'

// Typed reference to the sample survey — use this during development
// to seed the builder or test the respondent view without hitting storage.
export const sampleBiosimilarSurvey: Survey = sampleSurvey as Survey

// All sample surveys in one array — extend this as you add more seed files.
// Claude Code: to add a new sample, import it above and add it to this array.
export const allSampleSurveys: Survey[] = [sampleBiosimilarSurvey]