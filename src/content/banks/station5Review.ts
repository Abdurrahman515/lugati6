import type { Question } from '../../types'
import {
  makePoemComprehensionQuestion,
  makePoemFillQuestion,
  makePoemWordQuestion,
} from './poemUmar'
import { makeDescriptionPartQuestion, makeDescriptionStyleQuestion } from './description'
import { makeSummaryKeepQuestion } from './summary'
import { makeStation5PassageQuestion } from './station5Passages'
import { makeInterviewRoleQuestion, makeRiddleQuestion, makeStageQuestion } from './oral'

/** مولّد لكل موضوع في المحطة ٥ (الدروس ٥-١ إلى ٥-٨) */
export const station5ReviewMakers: (() => Question)[] = [
  makePoemWordQuestion,
  makePoemFillQuestion,
  makePoemComprehensionQuestion,
  makeDescriptionPartQuestion,
  makeDescriptionStyleQuestion,
  makeSummaryKeepQuestion,
  makeStation5PassageQuestion,
  makeStageQuestion,
  makeRiddleQuestion,
  makeInterviewRoleQuestion,
]