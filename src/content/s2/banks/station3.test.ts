import { describe, expect, it } from 'vitest'
import { s2Station3ReviewMakers } from './station3Review'
import { tanweenForm } from './tanweenCases'

describe('تنوين: الأشكال المولّدة', () => {
  it('المقصور والمنقوص والممدود', () => {
    expect(tanweenForm('فَتَى', 'maqsur', 'raf')).toBe('فَتًى')
    expect(tanweenForm('عَصَا', 'maqsur', 'jarr')).toBe('عَصًا')
    expect(tanweenForm('قَاضِي', 'manqus', 'raf')).toBe('قَاضٍ')
    expect(tanweenForm('قَاضِي', 'manqus', 'nasb')).toBe('قَاضِيًا')
    expect(tanweenForm('دُعَاء', 'mamdud', 'raf')).toBe('دُعَاءٌ')
    expect(tanweenForm('دُعَاء', 'mamdud', 'jarr')).toBe('دُعَاءٍ')
  })
})

describe('مولّدات مراجعة المحطة ٣ (ف٢)', () => {
  s2Station3ReviewMakers.forEach((make, k) => {
    it(`المولّد ${k}: خيار صحيح واحد، بلا تكرار، وتفسير لكل خيار`, () => {
      for (let i = 0; i < 300; i++) {
        const q = make()
        expect(q.prompt.length).toBeGreaterThan(5)
        if (q.kind !== 'choice') continue
        const texts = q.choices.map((c) => c.text)
        expect(new Set(texts).size).toBe(texts.length)
        expect(q.choices.filter((c) => c.correct)).toHaveLength(1)
        q.choices.forEach((c) => expect(c.why.length).toBeGreaterThan(10))
      }
    })
  })
})