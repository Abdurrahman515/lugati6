import type { Question } from '../../types'
import { pick } from '../../lib/random'
import { makeWordTypeQuestion } from './wordTypes'
import { makeVerbTypeQuestion } from './verbTypes'
import { makeSentenceTypeQuestion } from './sentenceTypes'
import { makeNumberQuestion } from './numberTypes'
import { makeIrabQuestion } from './irab'
import { makeStyleQuestion } from './styles'
import { makeHamzaQuestion } from './hamza'

const MAKERS: (() => Question)[] = [
  makeWordTypeQuestion,
  makeVerbTypeQuestion,
  makeSentenceTypeQuestion,
  makeNumberQuestion,
  makeIrabQuestion,
  makeStyleQuestion,
  makeHamzaQuestion,
]

export function makeMixedReviewQuestion(): Question {
  return pick(MAKERS)()
}