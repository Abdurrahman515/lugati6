import type { Question } from '../../../types'
import { makeHealthIntroQuestion, makeDiseaseQuestion } from './health'
import { makeCanningQuestion, makeLexQuestion, makePluralQuestion } from './canning'
import { makeShartQuestion } from './shart'
import { makeTawkidQuestion } from './tawkid'
import { makeJadwalQuestion, makeHealthTypeQuestion, makeQuestionWordQuestion } from './strategies'

/** مولّد لكل درس من ٢-١ إلى ٢-٧ (اللغة في ٢-٣ تُمثَّل بمولّدين) */
export const s2Station2ReviewMakers: (() => Question)[] = [
  makeHealthIntroQuestion,
  makeDiseaseQuestion,
  makeCanningQuestion,
  makeLexQuestion,
  makePluralQuestion,
  makeShartQuestion,
  makeTawkidQuestion,
  makeJadwalQuestion,
  makeHealthTypeQuestion,
  makeQuestionWordQuestion,
]