import type { Question } from '../../../types'
import { makeTanweenKindQuestion, makeTanweenQuestion } from './tanween'
import { makeNoTanweenQuestion, makeTanweenCaseQuestion, makeTanweenFormQuestion } from './tanweenCases'
import { makeAlefHarfQuestion, makeAlefNounQuestion, makeAlefVerbQuestion } from './alefLayina'
import { makeMaKindQuestion, makeMaQuestion, makeMinManQuestion } from './jarMa'

/** تنوين (٥) + ألف لينة (٣) + حروف الجر مع «ما» و«مَنْ» (٣): مولّد أو أكثر لكل درس من ٣-١ إلى ٣-٣ */
export const s2Station3ReviewMakers: (() => Question)[] = [
  makeTanweenQuestion,
  makeTanweenKindQuestion,
  makeTanweenFormQuestion,
  makeTanweenCaseQuestion,
  makeNoTanweenQuestion,
  makeAlefVerbQuestion,
  makeAlefNounQuestion,
  makeAlefHarfQuestion,
  makeMaQuestion,
  makeMaKindQuestion,
  makeMinManQuestion,
]