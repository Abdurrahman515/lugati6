import type { ChoiceQuestion, Question } from '../types'
import { shuffled } from './random'

export const SPEED_COUNT = 30
export const SPEED_SECONDS = 30
const MAX_CHOICES = 4

export type SpeedMaker = () => Question

export interface SpeedTool {
  id: string
  title: string
  emoji: string
  blurb: string
  makers: SpeedMaker[]
}

/** يُبقي الجواب الصحيح مع ثلاثة مشتتات كحد أقصى لتكفي ١٠ ثوانٍ */
function trimChoices(q: ChoiceQuestion): ChoiceQuestion {
  if (q.choices.length <= MAX_CHOICES) return q
  const right = q.choices.filter((c) => c.correct).slice(0, 1)
  const wrong = shuffled(q.choices.filter((c) => !c.correct)).slice(0, MAX_CHOICES - right.length)
  return { ...q, choices: [...right, ...wrong] }
}

/** يبني جولة بلا تكرار لنص السؤال، بتوزيع دوري على المولّدات */
export function buildSpeedSet(makers: SpeedMaker[], count = SPEED_COUNT): ChoiceQuestion[] {
  if (makers.length === 0) return []
  const out: ChoiceQuestion[] = []
  const seen = new Set<string>()
  const ids = makers.map((_, i) => i)
  let round = shuffled(ids)

  const draw = (): ChoiceQuestion | null => {
    if (round.length === 0) round = shuffled(ids)
    const q = makers[round.shift() as number]()
    return q.kind === 'choice' && !q.passage ? trimChoices(q) : null
  }

  for (let guard = 0; out.length < count && guard < count * 40; guard++) {
    const q = draw()
    if (!q || seen.has(q.prompt)) continue
    seen.add(q.prompt)
    out.push(q)
  }
  // احتياط: إن ضاق البنك عن العدد المطلوب نُكمل ولو بتكرار
  for (let guard = 0; out.length < count && guard < count * 10; guard++) {
    const q = draw()
    if (q) out.push(q)
  }
  return shuffled(out)
}