import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import { pick } from '../../lib/random'

export type NumKind = 'single' | 'dual' | 'mascSound' | 'femSound' | 'broken'
export const NUM_KINDS: NumKind[] = ['single', 'dual', 'mascSound', 'femSound', 'broken']
export const NUM_LABEL: Record<NumKind, string> = {
  single: 'مفرد',
  dual: 'مثنى',
  mascSound: 'جمع مذكر سالم',
  femSound: 'جمع مؤنث سالم',
  broken: 'جمع تكسير',
}

export interface BankNum {
  w: string
  kind: NumKind
  proof: string
}

const single = (w: string): BankNum => ({ w, kind: 'single', proof: 'تدل على واحد فقط' })
const dual = (w: string, s: string): BankNum => ({
  w,
  kind: 'dual',
  proof: `تدل على اثنين، وتنتهي بألف ونون، ومفردها «${s}»`,
})
const mascSound = (w: string, s: string): BankNum => ({
  w,
  kind: 'mascSound',
  proof: `تدل على جمع مذكر، وتنتهي بواو ونون، ومفردها «${s}» بقي سليماً`,
})
const femSound = (w: string, s: string): BankNum => ({
  w,
  kind: 'femSound',
  proof: `تنتهي بألف وتاء، ومفردها «${s}» بقي سليماً`,
})
const broken = (w: string, s: string, extra = ''): BankNum => ({
  w,
  kind: 'broken',
  proof: `تغيّر بناء مفردها «${s}» عند جمعها${extra}`,
})

export const NUM_BANK: BankNum[] = [
  single('كِتَابٌ'),
  single('مَدْرَسَةٌ'),
  single('قَلَمٌ'),
  single('طَالِبٌ'),
  single('مُعَلِّمَةٌ'),
  single('شَجَرَةٌ'),
  dual('كِتَابَانِ', 'كِتَابٌ'),
  dual('طَالِبَتَانِ', 'طَالِبَةٌ'),
  dual('قَلَمَانِ', 'قَلَمٌ'),
  dual('مَدْرَسَتَانِ', 'مَدْرَسَةٌ'),
  dual('مُعَلِّمَانِ', 'مُعَلِّمٌ'),
  mascSound('مُسْلِمُونَ', 'مُسْلِمٌ'),
  mascSound('مُعَلِّمُونَ', 'مُعَلِّمٌ'),
  mascSound('مُجْتَهِدُونَ', 'مُجْتَهِدٌ'),
  mascSound('مُهَنْدِسُونَ', 'مُهَنْدِسٌ'),
  femSound('طَالِبَاتٌ', 'طَالِبَةٌ'),
  femSound('مُعَلِّمَاتٌ', 'مُعَلِّمَةٌ'),
  femSound('مُسْلِمَاتٌ', 'مُسْلِمَةٌ'),
  femSound('سَيَّارَاتٌ', 'سَيَّارَةٌ'),
  broken('كُتُبٌ', 'كِتَابٌ'),
  broken('أَقْلَامٌ', 'قَلَمٌ'),
  broken('مَدَارِسُ', 'مَدْرَسَةٌ'),
  broken('رِجَالٌ', 'رَجُلٌ'),
  broken('طُلَّابٌ', 'طَالِبٌ'),
  broken('أَشْجَارٌ', 'شَجَرَةٌ'),
  broken('أَوْقَاتٌ', 'وَقْتٌ', '، مع أنها تنتهي بألف وتاء'),
]

export function byNum(w: string): BankNum {
  const found = NUM_BANK.find((b) => b.w === w)
  if (!found) throw new Error(`الكلمة غير موجودة في البنك: ${w}`)
  return found
}

const PICKED_RULE: Record<NumKind, string> = {
  single: 'المفرد بيدل على واحد فقط.',
  dual: 'المثنى بيدل على اثنين وبينتهي بألف ونون أو ياء ونون.',
  mascSound: 'جمع المذكر السالم بينتهي بواو ونون أو ياء ونون، ومفرده بيضل سليماً.',
  femSound: 'جمع المؤنث السالم بينتهي بألف وتاء، ومفرده بيضل سليماً.',
  broken: 'جمع التكسير بيتغيّر فيه بناء المفرد.',
}

export function explainNumWrong(target: BankNum, picked: NumKind): string {
  return `${PICKED_RULE[picked]} أما «${target.w}» فهي ${NUM_LABEL[target.kind]}: ${target.proof}.`
}

export function numSortItems(words: string[]): SortItem[] {
  return words.map((w) => {
    const b = byNum(w)
    const whyNot: Record<string, string> = {}
    for (const k of NUM_KINDS) {
      if (k !== b.kind) whyNot[k] = explainNumWrong(b, k)
    }
    return { text: b.w, bucket: b.kind, why: `«${b.w}» ${NUM_LABEL[b.kind]}: ${b.proof}.`, whyNot }
  })
}

export function makeNumberQuestion(): Question {
  const kind = pick(NUM_KINDS)
  const target = pick(NUM_BANK.filter((b) => b.kind === kind))
  return {
    kind: 'choice',
    id: 'number-type',
    prompt: `ما نوع هذا الاسم من حيث العدد؟ **${target.w}**`,
    choices: NUM_KINDS.map((k) =>
      k === target.kind
        ? { text: NUM_LABEL[k], correct: true, why: `أحسنتِ! «${target.w}» ${NUM_LABEL[k]}: ${target.proof}.` }
        : { text: NUM_LABEL[k], why: explainNumWrong(target, k) },
    ),
  }
}