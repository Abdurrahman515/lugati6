import { describe, expect, it } from 'vitest'
import type { Question } from '../../../types'
import { s2Station4ReviewMakers } from './station4Review'

describe('مولّدات المحطة ٤ (الفصل الثاني)', () => {
  s2Station4ReviewMakers.forEach((make, idx) => {
    it(`المولّد ${idx + 1}: خيار صحيح واحد وخيارات غير مكررة`, () => {
      for (let n = 0; n < 300; n++) {
        const q: Question = make()
        expect(q.kind).toBe('choice')
        if (q.kind !== 'choice') continue
        const texts = q.choices.map((c) => c.text)
        expect(new Set(texts).size).toBe(texts.length)
        expect(q.choices.filter((c) => c.correct).length).toBe(1)
        expect(q.choices.every((c) => c.why.length > 10)).toBe(true)
      }
    })
  })
})