import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import { pick } from '../../lib/random'

export type VerbKind = 'past' | 'present' | 'command'
export const VERB_KINDS: VerbKind[] = ['past', 'present', 'command']
export const VERB_LABEL: Record<VerbKind, string> = { past: 'الماضي', present: 'المضارع', command: 'الأمر' }
const VERB_NAME: Record<VerbKind, string> = { past: 'فعل ماضٍ', present: 'فعل مضارع', command: 'فعل أمر' }

export interface BankVerb {
  w: string
  kind: VerbKind
  proof: string
}

const past = (w: string, withTa: string, withTu: string): BankVerb => ({
  w,
  kind: 'past',
  proof: `تدل على حدث انتهى في الزمن الماضي، وتقبل تاء التأنيث الساكنة (${withTa}) وتاء الفاعل (${withTu})`,
})
const present = (w: string, withSeen: string): BankVerb => ({
  w,
  kind: 'present',
  proof: `تدل على حدث يقع الآن أو بعد قليل، وتقبل السين (${withSeen})`,
})
const command = (w: string, withYa: string): BankVerb => ({
  w,
  kind: 'command',
  proof: `تطلب حدثاً لم يقع بعد، وتقبل ياء المخاطبة (${withYa})`,
})

export const VERB_BANK: BankVerb[] = [
  past('كَتَبَ', 'كَتَبَتْ', 'كَتَبْتُ'),
  past('ذَهَبَ', 'ذَهَبَتْ', 'ذَهَبْتُ'),
  past('رَسَمَ', 'رَسَمَتْ', 'رَسَمْتُ'),
  past('لَعِبَ', 'لَعِبَتْ', 'لَعِبْتُ'),
  past('فَتَحَ', 'فَتَحَتْ', 'فَتَحْتُ'),
  past('سَمِعَ', 'سَمِعَتْ', 'سَمِعْتُ'),
  past('قَرَأَ', 'قَرَأَتْ', 'قَرَأْتُ'),
  present('يَقْرَأُ', 'سَيَقْرَأُ'),
  present('يَكْتُبُ', 'سَيَكْتُبُ'),
  present('تَرْسُمُ', 'سَتَرْسُمُ'),
  present('نَلْعَبُ', 'سَنَلْعَبُ'),
  present('تَذْهَبُ', 'سَتَذْهَبُ'),
  present('يَسْمَعُ', 'سَيَسْمَعُ'),
  present('أَكْتُبُ', 'سَأَكْتُبُ'),
  command('اُكْتُبْ', 'اُكْتُبِي'),
  command('اِرْسُمْ', 'اِرْسُمِي'),
  command('اِقْرَأْ', 'اِقْرَأِي'),
  command('اِفْتَحْ', 'اِفْتَحِي'),
  command('اِذْهَبْ', 'اِذْهَبِي'),
  command('اِسْمَعْ', 'اِسْمَعِي'),
  command('اِلْعَبْ', 'اِلْعَبِي'),
]

export function byVerb(w: string): BankVerb {
  const found = VERB_BANK.find((b) => b.w === w)
  if (!found) throw new Error(`الفعل غير موجود في البنك: ${w}`)
  return found
}

/** ما يعرفه من اختار هذا النوع خطأً: يعيد الطالبة إلى قاعدته */
const PICKED_RULE: Record<VerbKind, string> = {
  past: 'الفعل الماضي بيدل على حدث انتهى، وبيقبل تاء التأنيث الساكنة.',
  present: 'الفعل المضارع بيدل على حدث بيصير هلأ أو بعد شوي، وبيقبل السين أو سوف.',
  command: 'فعل الأمر بيطلب حدثاً، وبيقبل ياء المخاطبة.',
}

export function explainVerbWrong(target: BankVerb, picked: VerbKind): string {
  return `${PICKED_RULE[picked]} أما «${target.w}» فهي ${VERB_NAME[target.kind]}: ${target.proof}.`
}

export function verbSortItems(words: string[]): SortItem[] {
  return words.map((w) => {
    const b = byVerb(w)
    const whyNot: Record<string, string> = {}
    for (const k of VERB_KINDS) {
      if (k !== b.kind) whyNot[k] = explainVerbWrong(b, k)
    }
    return { text: b.w, bucket: b.kind, why: `«${b.w}» ${VERB_NAME[b.kind]}: ${b.proof}.`, whyNot }
  })
}

export function makeVerbTypeQuestion(): Question {
  const kind = pick(VERB_KINDS)
  const target = pick(VERB_BANK.filter((b) => b.kind === kind))
  return {
    kind: 'choice',
    id: 'verb-type',
    prompt: `ما نوع هذا الفعل؟ **${target.w}**`,
    choices: VERB_KINDS.map((k) =>
      k === target.kind
        ? { text: VERB_LABEL[k], correct: true, why: `أحسنتِ! «${target.w}» ${VERB_NAME[k]}: ${target.proof}.` }
        : { text: VERB_LABEL[k], why: explainVerbWrong(target, k) },
    ),
  }
}