import type { Question } from '../../lib/types'
import { getTypeDefinition } from '../../question-types/registry'

interface QuestionRendererProps {
  question: Question
  value: string | string[] | null
  onChange: (value: string | string[]) => void
  onAutoAdvance?: () => void
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  onAutoAdvance,
}: QuestionRendererProps) {
  const def = getTypeDefinition(question.type)
  return (
    <def.RespondentInput
      question={question}
      value={value}
      onChange={onChange}
      onAutoAdvance={onAutoAdvance}
    />
  )
}
