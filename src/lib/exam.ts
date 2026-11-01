import type { ExamConfig, Question } from '../types'
import { shuffled } from './random'

/** يبني أسئلة الاختبار بتوزيع دوري على المولّدات، بلا تكرار لنص السؤال */
export function buildExam(cfg: ExamConfig): Question[] {
  const out: Question[] = []
  const seen = new Set<string>()
  const ids = cfg.makers.map((_, i) => i)
  let round = shuffled(ids)
  for (let guard = 0; out.length < cfg.count && guard < cfg.count * 30; guard++) {
    if (round.length === 0) round = shuffled(ids)
    const q = cfg.makers[round.shift() as number]()
    if (seen.has(q.prompt)) continue
    seen.add(q.prompt)
    out.push(q)
  }
  return groupByPassage(shuffled(out))
}

/** الأسئلة المرتبطة بنص واحد تتجاور، فيُقرأ النص مرة واحدة تقريباً */
function groupByPassage(list: Question[]): Question[] {
  const groups = new Map<string, Question[]>()
  list.forEach((q, i) => {
    const key = q.passage ? `p:${q.passage.text}` : `q:${i}`
    const g = groups.get(key)
    if (g) g.push(q)
    else groups.set(key, [q])
  })
  return [...groups.values()].flat()
}

export const isPassed = (score: number, total: number, passPercent: number) =>
  total > 0 && score * 100 >= passPercent * total

export function correctAnswerOf(q: Question): string {
  if (q.kind === 'choice') return q.choices.find((c) => c.correct)?.text ?? ''
  return Array.isArray(q.answer) ? q.answer[0] : q.answer
}

export function explanationOf(q: Question): string {
  if (q.kind === 'choice') return q.choices.find((c) => c.correct)?.why ?? ''
  return q.why
}