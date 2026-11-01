import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import { pick, shuffled } from '../../lib/random'
import { choiceQ } from '../helpers'

export type Before = 'kasra' | 'damma' | 'fatha' | 'sukun' | 'madd'
export type FinalSeat = 'alif' | 'waw' | 'ya' | 'line'

export interface FinalWord {
  /** الكلمة مكتوبة كتابة صحيحة بحركاتها */
  spelled: string
  /** حال الحرف الذي قبل الهمزة المتطرفة */
  before: Before
}

const SEAT_OF: Record<Before, FinalSeat> = { kasra: 'ya', damma: 'waw', fatha: 'alif', sukun: 'line', madd: 'line' }
export const FINAL_SEATS: FinalSeat[] = ['alif', 'waw', 'ya', 'line']
export const FINAL_SEAT_LABEL: Record<FinalSeat, string> = {
  alif: 'على ألف',
  waw: 'على واو',
  ya: 'على ياء (نبرة)',
  line: 'مفردة على السطر',
}
const LETTER: Record<FinalSeat, string> = { alif: 'أ', waw: 'ؤ', ya: 'ئ', line: 'ء' }
const DESC: Record<Before, string> = {
  kasra: 'مكسور',
  damma: 'مضموم',
  fatha: 'مفتوح',
  sukun: 'ساكن',
  madd: 'حرف مدّ (ألف أو واو أو ياء ساكنة)',
}
const SEAT_REASON: Record<FinalSeat, string> = {
  alif: 'لأن الحرف الذي قبلها مفتوح',
  waw: 'لأن الحرف الذي قبلها مضموم',
  ya: 'لأن الحرف الذي قبلها مكسور',
  line: 'لأن الحرف الذي قبلها ساكن أو حرف مدّ',
}
const MISCONCEPTION = 'لأن حركة الهمزة نفسها هي التي تحدّد الحرف'

const group = (before: Before, words: string[]): FinalWord[] => words.map((spelled) => ({ spelled, before }))

export const FINAL_BANK: FinalWord[] = [
  ...group('kasra', [
    'شَاطِئٌ', 'قَارِئٌ', 'خَاطِئٌ', 'هَادِئٌ', 'دَافِئٌ', 'مَوْطِئٌ', 'بَادِئٌ', 'بَارِئٌ',
    'يُخْطِئُ', 'يُبْطِئُ', 'يُنْبِئُ', 'يَبْتَدِئُ', 'يَتَّكِئُ', 'مَبَادِئُ', 'يُنْشِئُ',
  ]),
  ...group('damma', [
    'لُؤْلُؤٌ', 'يَجْرُؤُ', 'تَبَاطُؤٌ', 'تَكَافُؤٌ', 'تَوَاطُؤٌ', 'تَنَبُّؤٌ', 'بُؤْبُؤٌ', 'امْرُؤٌ', 'تَهَيُّؤٌ',
  ]),
  ...group('fatha', [
    'مُبْتَدَأٌ', 'يَبْدَأُ', 'قَرَأَ', 'مَلْجَأٌ', 'مَرْفَأٌ', 'فَاجَأَ', 'مَلَأَ', 'أَخْطَأَ',
    'يَقْرَأُ', 'يَهْنَأُ', 'صَدَأٌ', 'يَعْبَأُ', 'بَدَأَ', 'هَدَأَ', 'نَشَأَ',
  ]),
  ...group('sukun', ['جُزْءٌ', 'دِفْءٌ', 'كُفْءٌ', 'عِبْءٌ', 'مِلْءٌ', 'نَشْءٌ', 'بَدْءٌ', 'بُطْءٌ', 'ضَوْءٌ', 'شَيْءٌ']),
  ...group('madd', [
    'غِذَاءٌ', 'سَمَاءٌ', 'عَطَاءٌ', 'فِنَاءٌ', 'جَرِيءٌ', 'لِوَاءٌ', 'وُضُوءٌ', 'نُشُوءٌ', 'دُعَاءٌ', 'هَنَاءٌ', 'صَحْرَاءُ',
  ]),
]

export function byFinal(spelled: string): FinalWord {
  const found = FINAL_BANK.find((b) => b.spelled === spelled)
  if (!found) throw new Error(`الكلمة غير موجودة في بنك المتطرفة: ${spelled}`)
  return found
}

/** آخر حرف همزة في الكلمة (ولو تلته حركات أو تنوين) */
const FINAL_RE = /[أؤئء](?=[\u064B-\u0652]*$)/

export const seatOfFinal = (w: FinalWord): FinalSeat => SEAT_OF[w.before]
/** تُعرض الهمزة المتطرفة منفصلة (ء) حتى لا تكشف الجواب */
export const detachedFinal = (spelled: string): string => spelled.replace(FINAL_RE, 'ء')
const withSeat = (spelled: string, seat: FinalSeat): string => spelled.replace(FINAL_RE, LETTER[seat])

const explainRight = (w: FinalWord): string =>
  `الحرف اللي قبل الهمزة في «${w.spelled}» ${DESC[w.before]}، فتُكتب الهمزة ${FINAL_SEAT_LABEL[seatOfFinal(w)]}.`

export const explainFinalWrong = (w: FinalWord, picked: FinalSeat): string =>
  `الهمزة المتطرفة بننظر لحركة الحرف اللي قبلها مش لحركتها هي. هون الحرف قبلها ${DESC[w.before]}، فتُكتب ${FINAL_SEAT_LABEL[seatOfFinal(w)]}، مش ${FINAL_SEAT_LABEL[picked]}.`

export function finalSeatQuestion(w: FinalWord): Question {
  const correct = seatOfFinal(w)
  return choiceQ(
    `final-seat-${w.spelled}`,
    `الهمزة المتطرفة في كلمة **${detachedFinal(w.spelled)}**، تُكتب:`,
    [FINAL_SEAT_LABEL[correct], explainRight(w)],
    FINAL_SEATS.filter((s) => s !== correct).map((s): [string, string] => [FINAL_SEAT_LABEL[s], explainFinalWrong(w, s)]),
  )
}

export function finalSpellingQuestion(w: FinalWord): Question {
  const correct = seatOfFinal(w)
  const others = shuffled(FINAL_SEATS.filter((s) => s !== correct)).slice(0, 2)
  return choiceQ(
    `final-spell-${w.spelled}`,
    `اختاري الكتابة الصحيحة للكلمة **${detachedFinal(w.spelled)}**:`,
    [w.spelled, explainRight(w)],
    others.map((s): [string, string] => [withSeat(w.spelled, s), explainFinalWrong(w, s)]),
  )
}

export function finalReasonQuestion(w: FinalWord): Question {
  const correct = seatOfFinal(w)
  const other = pick(FINAL_SEATS.filter((s) => s !== correct))
  const wrongWhy = `الحرف اللي قبل الهمزة في «${w.spelled}» ${DESC[w.before]}، فهذا مش السبب الصحيح.`
  return choiceQ(
    `final-why-${w.spelled}`,
    `لماذا كُتبت الهمزة المتطرفة في **${w.spelled}** ${FINAL_SEAT_LABEL[correct]}؟`,
    [SEAT_REASON[correct], explainRight(w)],
    [
      [SEAT_REASON[other], wrongWhy],
      [MISCONCEPTION, `العبرة بحركة الحرف اللي قبل الهمزة المتطرفة، مش بحركتها هي. هون الحرف قبلها ${DESC[w.before]}.`],
    ],
  )
}

export function makeFinalHamzaQuestion(): Question {
  const w = pick(FINAL_BANK)
  const r = Math.random()
  return r < 0.4 ? finalSeatQuestion(w) : r < 0.7 ? finalSpellingQuestion(w) : finalReasonQuestion(w)
}

export const FINAL_BUCKETS = FINAL_SEATS.map((s) => ({ id: s, label: FINAL_SEAT_LABEL[s] }))

export function finalSortItems(words: string[]): SortItem[] {
  return words.map((sp) => {
    const w = byFinal(sp)
    const whyNot: Record<string, string> = {}
    for (const s of FINAL_SEATS) if (s !== seatOfFinal(w)) whyNot[s] = explainFinalWrong(w, s)
    return { text: detachedFinal(sp), bucket: seatOfFinal(w), why: explainRight(w), whyNot }
  })
}