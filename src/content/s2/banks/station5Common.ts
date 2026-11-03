import type { ChoiceQuestion, Question, QuestionPassage } from '../../../types'
import { pick } from '../../../lib/random'

/** يُلحِق نصاً مرافقاً بسؤال اختيار من متعدد */
export const attachPassage = (q: ChoiceQuestion, passage: QuestionPassage): ChoiceQuestion => ({ ...q, passage })

/** مولّد يختار عشوائياً من قائمة أسئلة تُبنى طازجة في كل مرة */
export const fromList = (build: () => Question[]) => (): Question => pick(build())