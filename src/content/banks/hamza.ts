import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import { pick } from '../../lib/random'

export type Move = 'kasra' | 'damma' | 'fatha' | 'sukun'
export type Seat = 'alif' | 'waw' | 'ya'

const MOVE_LABEL: Record<Move, string> = { kasra: 'الكسرة', damma: 'الضمة', fatha: 'الفتحة', sukun: 'السكون' }
const STRENGTH: Record<Move, number> = { kasra: 3, damma: 2, fatha: 1, sukun: 0 }
const SEAT_OF: Record<Move, Seat | null> = { kasra: 'ya', damma: 'waw', fatha: 'alif', sukun: null }

export const SEATS: Seat[] = ['alif', 'waw', 'ya']
export const SEAT_LABEL: Record<Seat, string> = { alif: 'على ألف', waw: 'على واو', ya: 'على ياء' }
const SEAT_NAME: Record<Seat, string> = { alif: 'الألف', waw: 'الواو', ya: 'الياء' }
const SEAT_LETTER: Record<string, Seat> = { أ: 'alif', ؤ: 'waw', ئ: 'ya' }

export interface HamzaWord {
  /** الكلمة مكتوبة كتابة صحيحة بحركاتها */
  spelled: string
  /** حركة الهمزة */
  hamza: Move
  /** حركة الحرف الذي قبلها (الألف الساكنة قبلها تُعدّ سكوناً) */
  before: Move
}

const h = (spelled: string, hamza: Move, before: Move): HamzaWord => ({ spelled, hamza, before })

export const HAMZA_BANK: HamzaWord[] = [
  h('سَأَلَ', 'fatha', 'fatha'),
  h('سُئِلَ', 'kasra', 'damma'),
  h('يَئِسَ', 'kasra', 'fatha'),
  h('بِئْرٌ', 'sukun', 'kasra'),
  h('ذِئْبٌ', 'sukun', 'kasra'),
  h('رُؤُوسٌ', 'damma', 'damma'),
  h('فُؤَادٌ', 'fatha', 'damma'),
  h('سُؤَالٌ', 'fatha', 'damma'),
  h('مَسْؤُولٌ', 'damma', 'sukun'),
  h('مَسْأَلَةٌ', 'fatha', 'sukun'),
  h('يَسْأَلُ', 'fatha', 'sukun'),
  h('كَأْسٌ', 'sukun', 'fatha'),
  h('رَأْسٌ', 'sukun', 'fatha'),
  h('مُؤْمِنٌ', 'sukun', 'damma'),
  h('بُؤْسٌ', 'sukun', 'damma'),
  h('جُرْأَةٌ', 'fatha', 'sukun'),
  h('تَفَاؤُلٌ', 'damma', 'sukun'),
  h('قَائِلٌ', 'kasra', 'sukun'),
  h('مَسَائِلُ', 'kasra', 'sukun'),
  h('فِئَةٌ', 'fatha', 'kasra'),
  h('يَسْتَهْزِئُونَ', 'damma', 'kasra'),
  h('شُؤُونٌ', 'damma', 'damma'),
  h('لَئِيمٌ', 'kasra', 'fatha'),
  h('رَئِيسٌ', 'kasra', 'fatha'),
]

export function byHamza(spelled: string): HamzaWord {
  const found = HAMZA_BANK.find((b) => b.spelled === spelled)
  if (!found) throw new Error(`الكلمة غير موجودة في البنك: ${spelled}`)
  return found
}

export const strongerOf = (a: Move, b: Move): Move => (STRENGTH[a] >= STRENGTH[b] ? a : b)

/** الحرف الذي تُكتب عليه الهمزة بحسب القاعدة */
export function seatOf(w: HamzaWord): Seat {
  const seat = SEAT_OF[strongerOf(w.hamza, w.before)]
  if (!seat) throw new Error(`حركتان ساكنتان: ${w.spelled}`)
  return seat
}

/** الحرف الذي كُتبت عليه الهمزة فعلاً في الكلمة المكتوبة (للفحص الآلي) */
export function writtenSeatOf(spelled: string): Seat | null {
  const m = /[أؤئ]/.exec(spelled)
  return m ? SEAT_LETTER[m[0]] : null
}

/** تُعرض الكلمة بهمزة منفصلة (ء) حتى لا تكشف الجواب */
export const detached = (spelled: string): string => spelled.replace(/[أؤئ]/, 'ء')

const explainRight = (w: HamzaWord): string => {
  const strong = strongerOf(w.hamza, w.before)
  return `حركة الهمزة في «${w.spelled}» ${MOVE_LABEL[w.hamza]}، وحركة ما قبلها ${MOVE_LABEL[w.before]}، والأقوى منهما ${MOVE_LABEL[strong]}، فتُكتب الهمزة ${SEAT_LABEL[seatOf(w)]}.`
}

export function explainHamzaWrong(w: HamzaWord, picked: Seat): string {
  const strong = strongerOf(w.hamza, w.before)
  const weak = strong === w.hamza ? w.before : w.hamza
  if (SEAT_OF[weak] === picked) {
    return `يمكن اخترتِ ${SEAT_NAME[picked]} بسبب ${MOVE_LABEL[weak]}، لكنها الأضعف هنا. الترتيب من الأقوى: الكسرة ثم الضمة ثم الفتحة ثم السكون، والأقوى في «${w.spelled}» هي ${MOVE_LABEL[strong]}، فتُكتب ${SEAT_LABEL[seatOf(w)]}.`
  }
  return `${SEAT_NAME[picked]} ما بتناسب هالكلمة: حركتا الهمزة وما قبلها ${MOVE_LABEL[w.hamza]} و${MOVE_LABEL[w.before]}، وأقواهما ${MOVE_LABEL[strong]}، فتُكتب ${SEAT_LABEL[seatOf(w)]}.`
}

export function hamzaSortItems(words: string[]): SortItem[] {
  return words.map((sp) => {
    const w = byHamza(sp)
    const whyNot: Record<string, string> = {}
    for (const s of SEATS) {
      if (s !== seatOf(w)) whyNot[s] = explainHamzaWrong(w, s)
    }
    return { text: detached(w.spelled), bucket: seatOf(w), why: `${explainRight(w)}`, whyNot }
  })
}

export function hamzaQuestionFor(w: HamzaWord): Question {
  const correct = seatOf(w)
  return {
    kind: 'choice',
    id: `hamza-${w.spelled}`,
    prompt: `الهمزة المتوسطة في كلمة **${detached(w.spelled)}**، على أي حرف تُكتب؟`,
    choices: SEATS.map((s) =>
      s === correct
        ? { text: SEAT_LABEL[s], correct: true, why: `أحسنتِ! ${explainRight(w)}` }
        : { text: SEAT_LABEL[s], why: explainHamzaWrong(w, s) },
    ),
  }
}

export function makeHamzaQuestion(): Question {
  return hamzaQuestionFor(pick(HAMZA_BANK))
}