import type { Block, ChoiceQuestion } from '../types'
import type { SortItem } from '../widgets/SortWidget'

const MIN_WHY = 11

/** يضمن أن لكل خيار تفسيراً ذا معنى: الصحيح يُذكَّر بجوابه، والخطأ يُعاد إلى القاعدة */
function fullWhy(text: string, why: string, correct: boolean): string {
  if (why.length >= MIN_WHY) return why
  const base = why.trim()
  return correct
    ? `${base} الإجابة الصحيحة هي: «${text}».`
    : `${base} «${text}» مش الإجابة الصحيحة هون، أعيدي قراءة السؤال والقاعدة وجرّبي مرة ثانية.`
}

/** سؤال اختيار من متعدد كسؤال مستقل (للمولّدات): [النص، التفسير] للصحيح ولكل خطأ */
export const choiceQ = (
  id: string,
  prompt: string,
  right: [string, string],
  wrongs: [string, string][],
): ChoiceQuestion => ({
  kind: 'choice',
  id,
  prompt,
  choices: [
    { text: right[0], correct: true, why: fullWhy(right[0], right[1], true) },
    ...wrongs.map(([text, why]) => ({ text, why: fullWhy(text, why, false) })),
  ],
})

/** سؤال اختيار من متعدد ككتلة درس */
export const mcq = (
  id: string,
  prompt: string,
  right: [string, string],
  wrongs: [string, string][],
): Block => ({
  type: 'quiz',
  question: choiceQ(id, prompt, right, wrongs),
})

/** يبني عناصر أداة التصنيف: [الكلمة، معرّف الصندوق الصحيح، التفسير]. التلميح للتصنيف الخاطئ يُولَّد من التفسير */
export function makeSortItems(
  buckets: { id: string; label: string }[],
  rows: [string, string, string][],
): SortItem[] {
  return rows.map(([text, bucket, why]) => {
    const whyNot: Record<string, string> = {}
    buckets.forEach((b) => {
      if (b.id !== bucket) whyNot[b.id] = `«${text}» ما بتنتمي لـ«${b.label}». تلميح: ${why}`
    })
    return { text, bucket, why, whyNot }
  })
}