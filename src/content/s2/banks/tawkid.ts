import type { Question } from '../../../types'
import type { SortBucket, SortItem } from '../../../widgets/SortWidget'
import { choiceQ, makeSortItems } from '../../helpers'
import { pick } from '../../../lib/random'

type Kind = 'kull' | 'nafs' | 'ayn'
type Case = 'raf3' | 'nasb' | 'jarr'

interface Tawkid {
  text: string
  verb: string
  mu2kad: string
  lafz: string
  kind: Kind
  c: Case
}

export const TAWKID_SENTENCES: Tawkid[] = [
  { text: 'جَاءَ الطُّلَّابُ كُلُّهُمْ', verb: 'جَاءَ', mu2kad: 'الطُّلَّابُ', lafz: 'كُلُّهُمْ', kind: 'kull', c: 'raf3' },
  { text: 'قَرَأْتُ الكِتَابَ كُلَّهُ', verb: 'قَرَأْتُ', mu2kad: 'الكِتَابَ', lafz: 'كُلَّهُ', kind: 'kull', c: 'nasb' },
  { text: 'سَلَّمْتُ عَلَى الأَصْدِقَاءِ كُلِّهِمْ', verb: 'سَلَّمْتُ', mu2kad: 'الأَصْدِقَاءِ', lafz: 'كُلِّهِمْ', kind: 'kull', c: 'jarr' },
  { text: 'حَضَرَ المُدِيرُ نَفْسُهُ', verb: 'حَضَرَ', mu2kad: 'المُدِيرُ', lafz: 'نَفْسُهُ', kind: 'nafs', c: 'raf3' },
  { text: 'رَأَيْتُ المُعَلِّمَةَ نَفْسَهَا', verb: 'رَأَيْتُ', mu2kad: 'المُعَلِّمَةَ', lafz: 'نَفْسَهَا', kind: 'nafs', c: 'nasb' },
  { text: 'مَرَرْتُ بِالطَّبِيبِ نَفْسِهِ', verb: 'مَرَرْتُ', mu2kad: 'الطَّبِيبِ', lafz: 'نَفْسِهِ', kind: 'nafs', c: 'jarr' },
  { text: 'زَارَنَا الوَزِيرُ عَيْنُهُ', verb: 'زَارَنَا', mu2kad: 'الوَزِيرُ', lafz: 'عَيْنُهُ', kind: 'ayn', c: 'raf3' },
  { text: 'شَاهَدْتُ الفَنَّانَ عَيْنَهُ', verb: 'شَاهَدْتُ', mu2kad: 'الفَنَّانَ', lafz: 'عَيْنَهُ', kind: 'ayn', c: 'nasb' },
]

const CASE_LABEL: Record<Case, string> = { raf3: 'مرفوع', nasb: 'منصوب', jarr: 'مجرور' }
const CASE_NAME: Record<Case, string> = { raf3: 'الرفع', nasb: 'النصب', jarr: 'الجر' }

export function makeTawkidWordQuestion(): Question {
  const s = pick(TAWKID_SENTENCES)
  return choiceQ(
    `s2-tawkid-word-${s.text}`,
    `في الجملة: «${s.text}»\nما **لفظ التوكيد**؟`,
    [s.lafz, 'صح! هاللفظ جاء بعد الكلمة وبآخره ضمير يعود عليها، وهو اللي بيقوّي معناها.'],
    [
      [s.mu2kad, `«${s.mu2kad}» هي الكلمة المؤكَّدة (اللي بدنا نقوّي معناها)، مش لفظ التوكيد.`],
      [s.verb, `«${s.verb}» فعل بالجملة، وما إله علاقة بالتوكيد.`],
    ],
  )
}

export function makeTawkidCaseQuestion(): Question {
  const s = pick(TAWKID_SENTENCES)
  const wrongs = (['raf3', 'nasb', 'jarr'] as const).filter((c) => c !== s.c)
  return choiceQ(
    `s2-tawkid-case-${s.text}`,
    `في الجملة: «${s.text}»\nما **حالة** «${s.lafz}» الإعرابية؟`,
    [CASE_LABEL[s.c], `صح! «${s.mu2kad}» في حالة ${CASE_NAME[s.c]}، ولفظ التوكيد بيتبعه بالحالة نفسها.`],
    wrongs.map((c) => [CASE_LABEL[c], `لفظ التوكيد بيتبع «${s.mu2kad}»، وهي في حالة ${CASE_NAME[s.c]} مش ${CASE_NAME[c]}.`] as [string, string]),
  )
}

export function makeTawkidUseQuestion(): Question {
  const s = pick(TAWKID_SENTENCES)
  const KULL = 'يفيد العموم والشمول'
  const SAHW = 'يرفع احتمال السهو أو النسيان'
  const right = s.kind === 'kull' ? KULL : SAHW
  const other = s.kind === 'kull' ? SAHW : KULL
  return choiceQ(
    `s2-tawkid-use-${s.text}`,
    `ما فائدة لفظ التوكيد «${s.lafz}» في: «${s.text}»؟`,
    [right, s.kind === 'kull' ? 'صح! التوكيد بـ«كل» بيفيد العموم.' : 'صح! التوكيد بـ«نفس» و«عين» بيمنع احتمال السهو أو النسيان.'],
    [
      [other, s.kind === 'kull' ? 'هاي فائدة «نفس» و«عين»، أما «كل» فللعموم.' : 'هاي فائدة «كل»، أما «نفس» و«عين» فلرفع احتمال السهو والنسيان.'],
      ['يحدّد زمن الفعل', 'التوكيد ما بيحدّد الزمن، بيرسّخ المعنى ويقوّيه.'],
    ],
  )
}

export const makeTawkidQuestion = (): Question =>
  pick([makeTawkidWordQuestion, makeTawkidCaseQuestion, makeTawkidUseQuestion])()

export const TAWKID_BUCKETS: SortBucket[] = [
  { id: 'omoom', label: 'عموم وشمول (كل)', emoji: '🌍' },
  { id: 'sahw', label: 'نفي السهو والنسيان (نفس / عين)', emoji: '🎯' },
]
export const tawkidSortItems = (): SortItem[] =>
  makeSortItems(
    TAWKID_BUCKETS,
    TAWKID_SENTENCES.filter((_, i) => [0, 1, 3, 4, 6].includes(i)).map((s) => [
      s.text,
      s.kind === 'kull' ? 'omoom' : 'sahw',
      s.kind === 'kull' ? 'التوكيد بـ«كل» بيفيد العموم.' : 'التوكيد بـ«نفس» و«عين» بيرفع احتمال السهو أو النسيان.',
    ] as [string, string, string]),
  )