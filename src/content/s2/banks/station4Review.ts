import type { Question } from '../../../types'
import {
  makeJazmMeaningQuestion,
  makeJazmSignQuestion,
  makeKhamsaQuestion,
  makeMoodQuestion,
  makeNasbMeaningQuestion,
  makeNasbParticleQuestion,
  makeNasbSignQuestion,
  makeRafSignQuestion,
  makeSignQuestion,
} from './mudari'
import { makeMakanBeyondQuestion, makeMakanFormQuestion, makeMakanKindQuestion } from './zamanMakan'
import { makeMasdarQuestion, makeMasdarVsVerbQuestion, makeMasdarWaznQuestion } from './masdar'
import { makeNaskhHeadQuestion, makeNaskhLineQuestion, makeNaskhTipQuestion } from './naskh'

/** مولّد أو أكثر لكل درس من ٤-١ إلى ٤-٦ (رفع، نصب، جزم، زمان ومكان، مصدر، خط) */
export const s2Station4ReviewMakers: (() => Question)[] = [
  makeRafSignQuestion,
  makeKhamsaQuestion,
  makeNasbSignQuestion,
  makeNasbParticleQuestion,
  makeNasbMeaningQuestion,
  makeJazmSignQuestion,
  makeJazmMeaningQuestion,
  makeMoodQuestion,
  makeSignQuestion,
  makeMakanFormQuestion,
  makeMakanKindQuestion,
  makeMakanBeyondQuestion,
  makeMasdarQuestion,
  makeMasdarWaznQuestion,
  makeMasdarVsVerbQuestion,
  makeNaskhLineQuestion,
  makeNaskhHeadQuestion,
  makeNaskhTipQuestion,
]