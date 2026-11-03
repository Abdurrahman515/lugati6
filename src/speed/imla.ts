import { pick } from '../lib/random'
import type { SpeedMaker } from '../lib/speed'
import { HAMZA_BANK, hamzaQuestionFor } from '../content/banks/hamza'
import { FINAL_BANK, finalSeatQuestion } from '../content/banks/hamzaFinal'
import { IBN_BANK, ibnDecisionQuestion } from '../content/banks/ibn'
import { WASL_BANK, waslKindQuestion } from '../content/banks/waslQat'
import {
  makeAlefHarfQuestion,
  makeAlefNounQuestion,
  makeAlefVerbQuestion,
} from '../content/s2/banks/alefLayina'
import { makeMaQuestion, makeMinManQuestion } from '../content/s2/banks/jarMa'
import {
  makeNoTanweenQuestion,
  makeTanweenCaseQuestion,
  makeTanweenFormQuestion,
} from '../content/s2/banks/tanweenCases'

export const imlaMakers: SpeedMaker[] = [
  () => waslKindQuestion(pick(WASL_BANK)),
  () => ibnDecisionQuestion(pick(IBN_BANK)),
  () => hamzaQuestionFor(pick(HAMZA_BANK)),
  () => finalSeatQuestion(pick(FINAL_BANK)),
  makeTanweenFormQuestion,
  makeTanweenCaseQuestion,
  makeNoTanweenQuestion,
  makeAlefVerbQuestion,
  makeAlefNounQuestion,
  makeAlefHarfQuestion,
  makeMaQuestion,
  makeMinManQuestion,
]