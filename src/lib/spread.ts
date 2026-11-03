import type { Question } from '../types'

/** يكرّر المولّدات دورياً حتى يبلغ عدد الخانات المطلوب، فيتوازن وزن كل محطة مهما كان عدد مولّداتها */
export function spread(makers: (() => Question)[], slots: number): (() => Question)[] {
  return Array.from({ length: slots }, (_, i) => makers[i % makers.length])
}