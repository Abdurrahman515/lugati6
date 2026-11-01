import { toArabicDigits } from './arabicDigits'

/** «٢٣ ساعة و٤٥ دقيقة» من مدة بالمللي ثانية */
export function formatRemaining(ms: number): string {
  const totalMin = Math.max(1, Math.ceil(ms / 60000))
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  const parts: string[] = []
  if (h > 0) parts.push(`${toArabicDigits(h)} ساعة`)
  if (m > 0) parts.push(`${toArabicDigits(m)} دقيقة`)
  return parts.join(' و')
}