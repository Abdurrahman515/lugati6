import type { Question } from '../../types'
import { makeKanaQuestion, makeInnaQuestion, makeNawasikhMixQuestion } from './nawasikh'
import { makeDerivedQuestion } from './mushtaqat'
import { makeAlatQuestion } from './alat'
import { makeKhatQuestion } from './khat'

/** مولّد لكل موضوع في المحطة ٤ (الدروس ٤-١ إلى ٤-٥) */
export const station4ReviewMakers: (() => Question)[] = [
  makeKanaQuestion,
  makeInnaQuestion,
  makeNawasikhMixQuestion,
  makeDerivedQuestion,
  makeAlatQuestion,
  makeKhatQuestion,
]