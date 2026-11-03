import { describe, expect, it } from 'vitest'
import { buildSpeedSet, SPEED_COUNT } from '../lib/speed'
import { speedTools } from './index'

describe.each(speedTools)('$id', (tool) => {
  it('كل مولّد ينتج أسئلة اختيار من متعدد صالحة للسرعة', () => {
    tool.makers.forEach((make, i) => {
      let usable = 0
      for (let n = 0; n < 60; n++) {
        const q = make()
        if (q.kind === 'choice' && !q.passage) usable++
      }
      expect(usable, `المولّد رقم ${i} لا ينتج سؤال سرعة`).toBeGreaterThan(0)
    })
  })

  it('الجولة ٣٠ سؤالاً، بجواب صحيح واحد، وبلا تكرار تقريباً', () => {
    for (let run = 0; run < 100; run++) {
      const set = buildSpeedSet(tool.makers)
      expect(set).toHaveLength(SPEED_COUNT)
      for (const q of set) {
        expect(q.choices.length).toBeGreaterThanOrEqual(2)
        expect(q.choices.length).toBeLessThanOrEqual(4)
        expect(q.choices.filter((c) => c.correct)).toHaveLength(1)
        expect(new Set(q.choices.map((c) => c.text)).size).toBe(q.choices.length)
      }
      expect(new Set(set.map((q) => q.prompt)).size).toBeGreaterThanOrEqual(26)
    }
  })
})