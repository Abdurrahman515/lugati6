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
  return shuffled(out)
}

export const isPassed = (score: number, total: number, passPercent: number) =>
  total > 0 && score * 100 >= passPercent * total