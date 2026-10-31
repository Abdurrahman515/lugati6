import { describe, expect, it } from 'vitest'
import type { Question } from '../types'
import type { SortData } from '../widgets/SortWidget'
import { allLessons } from './index'
import { WORD_BANK } from './banks/wordTypes'

function check(q: Question, where: string) {
  if (q.kind === 'choice') {
    expect(q.choices.filter((c) => c.correct).length, `${where}: خيار صحيح واحد`).toBe(1)
    expect(new Set(q.choices.map((c) => c.text)).size, `${where}: خيارات غير مكررة`).toBe(q.choices.length)
    for (const c of q.choices) expect(c.why.length, `${where}: تفسير لكل خيار`).toBeGreaterThan(10)
  } else {
    expect(q.why.length, `${where}: شرح الحل`).toBeGreaterThan(10)
    for (const w of q.wrong ?? []) expect(w.why.length, `${where}: تفسير الخطأ`).toBeGreaterThan(10)
  }
}

describe('المحتوى', () => {
  it('معرّفات الدروس فريدة', () => {
    const ids = allLessons.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('بنك الكلمات بلا تكرار', () => {
    const words = WORD_BANK.map((b) => b.w)
    expect(new Set(words).size).toBe(words.length)
  })

  for (const lesson of allLessons) {
    it(`الدرس ${lesson.id}: ${lesson.title}`, () => {
      for (const [i, b] of lesson.blocks.entries()) {
        const where = `${lesson.id}#${i}`
        if (b.type === 'quiz') check(b.question, where)
        if (b.type === 'practice') {
          for (let n = 0; n < 300; n++) check(b.make(), where)
        }
        if (b.type === 'widget' && b.widget === 'sort') {
          const d = b.data as SortData
          const ids = d.buckets.map((x) => x.id)
          for (const item of d.items) {
            expect(ids, where).toContain(item.bucket)
            for (const id of ids) {
              if (id !== item.bucket) expect(item.whyNot[id]?.length, `${where}: ${item.text}`).toBeGreaterThan(10)
            }
          }
        }
      }
    })
  }
})