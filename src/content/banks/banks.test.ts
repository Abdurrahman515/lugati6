import { describe, expect, it } from 'vitest'
import { stripDiacritics } from '../../lib/arabicText'
import { HAMZA_BANK, seatOf, writtenSeatOf } from './hamza'
import { IRAB_BANK, caseOf, shownWord } from './irab'
import { NUM_BANK } from './numberTypes'
import { SENTENCE_BANK } from './sentenceTypes'
import { VERB_BANK } from './verbTypes'
import { STYLE_BANK } from './styles'


const unique = (xs: string[]) => new Set(xs).size === xs.length

describe('البنوك', () => {
  it('لا تكرار في البنوك', () => {
    expect(unique(VERB_BANK.map((b) => b.w))).toBe(true)
    expect(unique(NUM_BANK.map((b) => b.w))).toBe(true)
    expect(unique(HAMZA_BANK.map((b) => b.spelled))).toBe(true)
    expect(unique(SENTENCE_BANK.map((b) => b.id))).toBe(true)
    expect(unique(SENTENCE_BANK.map((b) => b.s))).toBe(true)
    expect(unique(IRAB_BANK.map((b) => b.id))).toBe(true)
    expect(unique(STYLE_BANK.map((b) => b.id))).toBe(true)
    expect(unique(STYLE_BANK.map((b) => b.s))).toBe(true)
  })

  it('الهمزة: الحرف المكتوب يطابق القاعدة', () => {
    for (const w of HAMZA_BANK) {
      expect(w.spelled.match(/[أؤئ]/g)?.length, w.spelled).toBe(1)
      expect(writtenSeatOf(w.spelled), w.spelled).toBe(seatOf(w))
    }
  })

  it('الإعراب: نهاية الكلمة تنسجم مع نوعها وحالتها', () => {
    for (const i of IRAB_BANK) {
      const base = stripDiacritics(shownWord(i.w))
      const c = caseOf(i)
      const where = `${i.id}: ${i.w}`
      if (i.form === 'mascSound') expect(base.endsWith(c === 'raf' ? 'ون' : 'ين'), where).toBe(true)
      if (i.form === 'dual') expect(base.endsWith(c === 'raf' ? 'ان' : 'ين'), where).toBe(true)
      if (i.form === 'femSound') expect(base.endsWith('ات'), where).toBe(true)
      if (i.form === 'five') expect(base.endsWith(c === 'raf' ? 'وك' : c === 'nasb' ? 'اك' : 'يك'), where).toBe(true)
    }
  })
})