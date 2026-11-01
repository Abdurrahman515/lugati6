import type { DuelRound } from '../../widgets/DuelWidget'
import type { Move } from './hamza'
import { SEAT_LABEL, byHamza, detached, seatOf, strongerOf } from './hamza'

const LABEL: Record<Move, string> = { kasra: 'الكسرة', damma: 'الضمة', fatha: 'الفتحة', sukun: 'السكون' }

/** كلمات من بنك الهمزة المتوسطة تتنافس فيها حركتان مختلفتان */
export function duelRounds(words: string[]): DuelRound[] {
  return words.map((sp) => {
    const w = byHamza(sp)
    if (w.hamza === w.before) throw new Error(`حركتان متساويتان: ${sp}`)
    const strong = strongerOf(w.hamza, w.before)
    const winner = strong === w.hamza ? 'hamza' : 'before'
    const loser = winner === 'hamza' ? w.before : w.hamza
    return {
      word: detached(sp),
      hamza: LABEL[w.hamza],
      before: LABEL[w.before],
      winner,
      why: `${LABEL[strong]} أقوى من ${LABEL[loser]}، فتُكتب الهمزة في «${sp}» ${SEAT_LABEL[seatOf(w)]}.`,
      whyNot: `الأقوى هون ${LABEL[strong]}. الترتيب من الأقوى: الكسرة ثم الضمة ثم الفتحة ثم السكون.`,
    }
  })
}