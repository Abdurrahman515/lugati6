import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import { pick } from '../../lib/random'

export type WordKind = 'noun' | 'verb' | 'particle'
export const KINDS: WordKind[] = ['noun', 'verb', 'particle']
export const KIND_LABEL: Record<WordKind, string> = { noun: 'اسم', verb: 'فعل', particle: 'حرف' }

export interface BankWord {
  w: string
  kind: WordKind
  proof: string
}

const noun = (w: string, withAl: string): BankWord => ({
  w,
  kind: 'noun',
  proof: `فيها تنوين، وتقبل «ال» التعريف (${withAl})`,
})
const pastVerb = (w: string, withTa: string): BankWord => ({
  w,
  kind: 'verb',
  proof: `تدل على حدث وقع في الماضي، وتقبل تاء التأنيث الساكنة (${withTa})`,
})
const presentVerb = (w: string, withSeen: string): BankWord => ({
  w,
  kind: 'verb',
  proof: `تدل على حدث يقع الآن أو بعد قليل، وتقبل السين (${withSeen})`,
})
const commandVerb = (w: string, withYa: string): BankWord => ({
  w,
  kind: 'verb',
  proof: `تطلب حدثاً، وتقبل ياء المخاطبة (${withYa})`,
})
const particle = (w: string, group: string, example: string): BankWord => ({
  w,
  kind: 'particle',
  proof: `لا معنى لها وحدها، ويظهر معناها مع غيرها (${example})، وهي من ${group}`,
})

export const WORD_BANK: BankWord[] = [
  noun('كِتابٌ', 'الكِتابُ'),
  noun('حَدِيقَةٌ', 'الحَدِيقَةُ'),
  noun('قَلَمٌ', 'القَلَمُ'),
  noun('مَدْرَسَةٌ', 'المَدْرَسَةُ'),
  noun('وَرْدَةٌ', 'الوَرْدَةُ'),
  noun('بَيْتٌ', 'البَيْتُ'),
  noun('شَجَرَةٌ', 'الشَّجَرَةُ'),
  noun('نَهْرٌ', 'النَّهْرُ'),
  pastVerb('كَتَبَ', 'كَتَبَتْ'),
  pastVerb('ذَهَبَ', 'ذَهَبَتْ'),
  pastVerb('رَسَمَ', 'رَسَمَتْ'),
  pastVerb('لَعِبَ', 'لَعِبَتْ'),
  presentVerb('يَقْرَأُ', 'سَيَقْرَأُ'),
  presentVerb('يَكْتُبُ', 'سَيَكْتُبُ'),
  presentVerb('يَرْسُمُ', 'سَيَرْسُمُ'),
  commandVerb('اُكْتُبْ', 'اُكْتُبِي'),
  commandVerb('اِرْسُمْ', 'اِرْسُمِي'),
  commandVerb('اِشْرَبْ', 'اِشْرَبِي'),
  particle('فِي', 'حروف الجر', 'فِي البَيْتِ'),
  particle('عَلَى', 'حروف الجر', 'عَلَى الطَّاوِلَةِ'),
  particle('إِلَى', 'حروف الجر', 'إِلَى المَدْرَسَةِ'),
  particle('مِنْ', 'حروف الجر', 'مِنَ الحَدِيقَةِ'),
  particle('عَنْ', 'حروف الجر', 'عَنِ الكِتابِ'),
  particle('ثُمَّ', 'حروف العطف', 'قَرَأْتُ ثُمَّ كَتَبْتُ'),
  particle('يا', 'حروف النداء', 'يا مُحَمَّدُ'),
]

export function byWord(w: string): BankWord {
  const found = WORD_BANK.find((b) => b.w === w)
  if (!found) throw new Error(`الكلمة غير موجودة في البنك: ${w}`)
  return found
}

/** كل تفسير يبيّن الفهم الخاطئ المحتمل ويعيد الطالبة إلى القاعدة */
const WRONG: Record<WordKind, Record<WordKind, (w: string) => string>> = {
  noun: {
    noun: () => '',
    verb: (w) =>
      `الفعل بيدل على حدث ومعه زمن، أما «${w}» فهي اسم لشي أو مكان وما فيها زمن. جرّبي تضيفي «ال» التعريف: بتقبلها، والفعل ما بيقبلها.`,
    particle: (w) =>
      `الحرف ما إله معنى لحاله، أما «${w}» فإلها معنى كامل بنفسها: بتدل على شي منعرفه. وكمان بتقبل «ال» التعريف، والحرف ما بيقبلها.`,
  },
  verb: {
    verb: () => '',
    noun: (w) =>
      `الاسم ما فيه زمن، أما «${w}» ففيها حدث وزمن. وكمان ما بتقبل التنوين ولا «ال» التعريف، وهدول علامات الاسم.`,
    particle: (w) =>
      `الحرف ما إله معنى لحاله، أما «${w}» فبتدل على حدث (شغلة بتصير) ومعها زمن، يعني هي فعل.`,
  },
  particle: {
    particle: () => '',
    noun: (w) =>
      `الاسم بيدل على معنى كامل بنفسه، أما «${w}» فما إلها معنى لحالها، وما بتقبل التنوين ولا «ال» التعريف، يعني هي حرف.`,
    verb: (w) =>
      `الفعل بيدل على حدث ومعه زمن، أما «${w}» فما بتدل على حدث ولا على زمن، بل بتربط الكلمات ببعضها، يعني هي حرف.`,
  },
}

export function explainWrong(correct: WordKind, picked: WordKind, w: string): string {
  return WRONG[correct][picked](w)
}

export function sortItemsFor(words: string[]): SortItem[] {
  return words.map((w) => {
    const b = byWord(w)
    const whyNot: Record<string, string> = {}
    for (const k of KINDS) {
      if (k !== b.kind) whyNot[k] = explainWrong(b.kind, k, b.w)
    }
    return { text: b.w, bucket: b.kind, why: `«${b.w}» ${KIND_LABEL[b.kind]}: ${b.proof}.`, whyNot }
  })
}

export function makeWordTypeQuestion(): Question {
  const kind = pick(KINDS)
  const target = pick(WORD_BANK.filter((b) => b.kind === kind))
  return {
    kind: 'choice',
    id: 'word-type',
    prompt: `ما نوع هذه الكلمة؟ **${target.w}**`,
    choices: KINDS.map((k) =>
      k === target.kind
        ? { text: KIND_LABEL[k], correct: true, why: `أحسنتِ! «${target.w}» ${KIND_LABEL[k]}: ${target.proof}.` }
        : { text: KIND_LABEL[k], why: explainWrong(target.kind, k, target.w) },
    ),
  }
}