import type { SpeedMaker } from '../lib/speed'
import { makeAlatQuestion } from '../content/banks/alat'
import { makeDerivedQuestion } from '../content/banks/mushtaqat'
import { makeMasdarQuestion, makeMasdarVsVerbQuestion, makeMasdarWaznQuestion } from '../content/s2/banks/masdar'
import { makeMizanQuestion } from '../content/s2/banks/mizan'
import { makeMakanBeyondQuestion, makeMakanFormQuestion, makeMakanKindQuestion } from '../content/s2/banks/zamanMakan'

export const sarfMakers: SpeedMaker[] = [
  makeMizanQuestion,
  makeDerivedQuestion,
  makeAlatQuestion,
  makeMakanFormQuestion,
  makeMakanKindQuestion,
  makeMakanBeyondQuestion,
  makeMasdarQuestion,
  makeMasdarWaznQuestion,
  makeMasdarVsVerbQuestion,
]