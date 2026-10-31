const DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g
const PUNCTUATION = /[.,،؛:!؟?"'«»()[\]{}–—-]/g

export interface NormalizeOptions {
  /** عند true لا تُوحَّد الهمزات (أ/إ/آ/ا) ولا (ى/ي) ولا (ة/ه) */
  exactSpelling?: boolean
}

export function stripDiacritics(s: string): string {
  return s.replace(DIACRITICS, '')
}

export function normalizeSpaces(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

export function unifyLetters(s: string): string {
  return s.replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
}

export function normalizeAnswer(s: string, { exactSpelling = false }: NormalizeOptions = {}): string {
  const base = normalizeSpaces(stripDiacritics(s).replace(PUNCTUATION, ' '))
  return exactSpelling ? base : unifyLetters(base)
}

export function isAnswerCorrect(
  input: string,
  accepted: string | string[],
  options?: NormalizeOptions,
): boolean {
  const typed = normalizeAnswer(input, options)
  if (typed.length === 0) return false
  const list = Array.isArray(accepted) ? accepted : [accepted]
  return list.some((a) => normalizeAnswer(a, options) === typed)
}