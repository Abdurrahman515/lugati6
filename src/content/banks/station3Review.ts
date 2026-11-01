import type { Question } from '../../types'
import { makeHamzaQuestion } from './hamza'
import { makeWaslQuestion } from './waslQat'
import { makeIbnQuestion } from './ibn'
import { makeFinalHamzaQuestion } from './hamzaFinal'
import { makePassageQuestion } from './spellingPassages'

/** مولّد لكل موضوع في المحطة ٣ (الدروس ٣-١ إلى ٣-٤) */
export const station3ReviewMakers: (() => Question)[] = [
  makeWaslQuestion,
  makeIbnQuestion,
  makeHamzaQuestion,
  makeFinalHamzaQuestion,
  makePassageQuestion,
]