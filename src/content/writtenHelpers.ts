import type { Block, WrittenQuestion, WrongAnswer } from '../types'

/** سؤال كتابي بتدقيق إملائي (الهمزات تُقارَن بدقة) */
export const writtenQ = (
  id: string,
  prompt: string,
  answer: string | string[],
  why: string,
  wrong?: WrongAnswer[],
): WrittenQuestion => ({ kind: 'written', id, prompt, answer, why, wrong, exactSpelling: true })

/** سؤال كتابي ككتلة درس */
export const wq = (
  id: string,
  prompt: string,
  answer: string | string[],
  why: string,
  wrong?: WrongAnswer[],
): Block => ({ type: 'quiz', question: writtenQ(id, prompt, answer, why, wrong) })