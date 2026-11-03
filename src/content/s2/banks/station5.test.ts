import { describe, expect, it } from 'vitest'
import type { Question } from '../../../types'
import { s2Station5ReviewMakers } from './station5Review'

function check(q: Question, where: string) {
  if (q.kind === 'choice') {
    expect(q.choices.filter((c) => c.correct).length, `${where}: خيار صحيح واحد`).toBe(1)
    expect(new Set(q.choices.map((c) => c.text)).size, `${where}: خيارات غير مكررة`).toBe(q.choices.length)
    for (const c of q.choices) expect(c.why.length, `${where}: تفسير لكل خيار`).toBeGreaterThan(10)
  } else {
    expect(q.why.length, `${where}: شرح الحل`).toBeGreaterThan(10)
  }
  if (q.passage) expect(q.passage.text.length, `${where}: نص مرافق`).toBeGreaterThan(20)
}

describe('مولّدات المحطة ٥ (الفصل الثاني)', () => {
  s2Station5ReviewMakers.forEach((make, i) => {
    it(`المولّد ${i + 1}`, () => {
      for (let n = 0; n < 300; n++) check(make(), `maker-${i + 1}`)
    })
  })
})