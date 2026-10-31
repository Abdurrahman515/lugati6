import { describe, expect, it } from 'vitest'
import { isAnswerCorrect, normalizeAnswer } from './arabicText'

describe('arabicText', () => {
  it('يتجاهل التشكيل والتطويل والمسافات الزائدة', () => {
    expect(normalizeAnswer('  ذَهَبَ  ')).toBe('ذهب')
    expect(normalizeAnswer('كـتـاب')).toBe('كتاب')
  })

  it('يوحّد الهمزات والتاء المربوطة عند عدم الإملاء', () => {
    expect(isAnswerCorrect('اكل', 'أكل')).toBe(true)
    expect(isAnswerCorrect('مدرسه', 'مدرسة')).toBe(true)
  })

  it('يقارن بدقة عند exactSpelling', () => {
    expect(isAnswerCorrect('اكل', 'أكل', { exactSpelling: true })).toBe(false)
    expect(isAnswerCorrect('مدرسه', 'مدرسة', { exactSpelling: true })).toBe(false)
    expect(isAnswerCorrect('أَكَلَ', 'أكل', { exactSpelling: true })).toBe(true)
  })

  it('يرفض الإجابة الفارغة', () => {
    expect(isAnswerCorrect('   ', 'ذهب')).toBe(false)
  })

  it('يقبل عدة إجابات', () => {
    expect(isAnswerCorrect('ذهبت', ['ذهب', 'ذهبت'])).toBe(true)
  })
})