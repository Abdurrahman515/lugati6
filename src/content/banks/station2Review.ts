import type { Question } from '../../types'
import { shuffled } from '../../lib/random'
import {
  makeAbuBakrQuestion,
  makeBrowseQuestion,
  makeIntroQuestion,
  makeSkimQuestion,
} from './station2'
import { makeMadhQuestion } from './madh'
import { makeTahdhirQuestion } from './tahdhir'

/** مولّد لكل درس من ٢-١ إلى ٢-٦ */
export const station2ReviewMakers: (() => Question)[] = [
  makeIntroQuestion,
  makeAbuBakrQuestion,
  makeMadhQuestion,
  makeTahdhirQuestion,
  makeBrowseQuestion,
  makeSkimQuestion,
]

export function makeStation2ReviewQuestion(): Question {
  return shuffled(station2ReviewMakers)[0]()
}