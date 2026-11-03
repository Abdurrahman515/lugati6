import { useSyncExternalStore } from 'react'

export interface Mistake {
  lessonId: string
  questionId: string
  prompt: string
  at: number
}

export interface ExamResult {
  at: number
  score: number
  total: number
  passed: boolean
}

export interface SpeedBest {
  score: number
  total: number
  at: number
}

export interface Progress {
  version: 1
  stars: Record<string, number>
  mistakes: Mistake[]
  exams: Record<string, ExamResult[]>
  /** وقت انتهاء قفل الاختبار (بالمللي ثانية) بعد الرسوب */
  locks: Record<string, number>
  speed: Record<string, SpeedBest>
}

const KEY = 'lugha-app:v1'

const empty = (): Progress => ({ version: 1, stars: {}, mistakes: [], exams: {}, locks: {}, speed: {} })

function asRecord<T>(v: unknown): Record<string, T> {
  return typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Record<string, T>) : {}
}

function sanitize(raw: unknown): Progress | null {
  if (typeof raw !== 'object' || raw === null) return null
  const r = raw as Record<string, unknown>
  if (r.version !== 1) return null
  return {
    version: 1,
    stars: asRecord<number>(r.stars),
    mistakes: Array.isArray(r.mistakes) ? (r.mistakes as Mistake[]) : [],
    exams: asRecord<ExamResult[]>(r.exams),
    locks: asRecord<number>(r.locks),
    speed: asRecord<SpeedBest>(r.speed),
  }
}

function load(): Progress {
  try {
    const text = localStorage.getItem(KEY)
    if (text) {
      const p = sanitize(JSON.parse(text))
      if (p) return p
    }
  } catch {
    /* التخزين غير متاح أو التالف: نبدأ من الصفر */
  }
  return empty()
}

let cache: Progress | null = null
const listeners = new Set<() => void>()

export function getProgress(): Progress {
  if (!cache) cache = load()
  return cache
}

function commit(next: Progress): void {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* نُبقي النسخة في الذاكرة فقط */
  }
  listeners.forEach((l) => l())
}

export function subscribeProgress(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribeProgress, getProgress)
}

export function recordStars(lessonId: string, stars: number): void {
  const p = getProgress()
  const best = Math.max(p.stars[lessonId] ?? 0, stars)
  commit({ ...p, stars: { ...p.stars, [lessonId]: best } })
}

export function recordMistake(m: Omit<Mistake, 'at'>): void {
  const p = getProgress()
  const mistakes = [...p.mistakes, { ...m, at: Date.now() }].slice(-200)
  commit({ ...p, mistakes })
}

export function exportProgress(): string {
  return JSON.stringify(getProgress(), null, 2)
}

export function importProgress(text: string): boolean {
  try {
    const p = sanitize(JSON.parse(text))
    if (!p) return false
    commit(p)
    return true
  } catch {
    return false
  }
}

/** يسجّل نتيجة اختبار، ويقفله lockHours ساعة إن لم تنجح الطالبة */
export function recordExam(examId: string, r: Omit<ExamResult, 'at'>, lockHours?: number): void {
  const p = getProgress()
  const list = [...(p.exams[examId] ?? []), { ...r, at: Date.now() }].slice(-20)
  const locks = { ...p.locks }
  if (!r.passed && lockHours) locks[examId] = Date.now() + lockHours * 3600000
  else delete locks[examId]
  commit({ ...p, exams: { ...p.exams, [examId]: list }, locks })
}

/** المدة المتبقية من قفل الاختبار بالمللي ثانية (٠ إن لم يكن مقفلاً) */
export function lockRemaining(examId: string): number {
  const until = getProgress().locks[examId] ?? 0
  return Math.max(0, until - Date.now())
}


/** يحفظ نتيجة السرعة إن كانت أفضل من السابقة. يُرجع true إن كانت الأفضل */
export function recordSpeed(toolId: string, score: number, total: number): boolean {
  const p = getProgress()
  const prev = p.speed[toolId]
  if (prev && score <= prev.score) return false
  commit({ ...p, speed: { ...p.speed, [toolId]: { score, total, at: Date.now() } } })
  return true
}