import type { Question } from '../../../types'
import { makePoemUnderstandQuestion, makePoemVocabQuestion } from './poemMutanabbi'
import { makeDialoguePassageQuestion, makeDialogueStructureQuestion, makeDialogueWritingQuestion } from './dialogue'
import {
  makeHeadlineQuestion,
  makeNewsComponentQuestion,
  makeNewsDefinitionQuestion,
  makeNewsSixQuestion,
  makeNewsStepQuestion,
} from './news'
import {
  makeInstructionFieldQuestion,
  makeInstructionPassageQuestion,
  makeInstructionTraitQuestion,
  makeInstructionWritingQuestion,
  makeSequenceQuestion,
} from './instruction'
import { makeOralPrepQuestion, makeOralTermQuestion } from './oralS2'

/** مولّد أو أكثر لكل درس من ٥-١ إلى ٥-٨ */
export const s2Station5ReviewMakers: (() => Question)[] = [
  // ٥-١ النص الشعري
  makePoemVocabQuestion,
  makePoemUnderstandQuestion,
  // ٥-٢ بنية النص الحواري و٥-٥ كتابة الحوار
  makeDialogueStructureQuestion,
  makeDialoguePassageQuestion,
  makeDialogueWritingQuestion,
  // ٥-٣ بنية الخبر و٥-٦ كتابته
  makeNewsComponentQuestion,
  makeNewsSixQuestion,
  makeNewsDefinitionQuestion,
  makeHeadlineQuestion,
  makeNewsStepQuestion,
  // ٥-٤ بنية النص الإرشادي و٥-٧ كتابته
  makeInstructionTraitQuestion,
  makeInstructionFieldQuestion,
  makeInstructionPassageQuestion,
  makeSequenceQuestion,
  makeInstructionWritingQuestion,
  // ٥-٨ التواصل الشفهي
  makeOralTermQuestion,
  makeOralPrepQuestion,
]