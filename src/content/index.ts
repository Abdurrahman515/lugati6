import type { ExamConfig, Lesson, Semester } from '../types'
import { lesson11 } from './lesson-1-1'
import { lesson12 } from './lesson-1-2'
import { lesson13 } from './lesson-1-3'
import { lesson14 } from './lesson-1-4'
import { lesson15 } from './lesson-1-5'
import { lesson16 } from './lesson-1-6'
import { lesson17 } from './lesson-1-7'
import { lesson18 } from './lesson-1-8'
import { lesson19 } from './lesson-1-9'
import { lesson21 } from './lesson-2-1'
import { lesson22 } from './lesson-2-2'
import { lesson23 } from './lesson-2-3'
import { lesson24 } from './lesson-2-4'
import { lesson25 } from './lesson-2-5'
import { lesson26 } from './lesson-2-6'
import { lesson31 } from './lesson-3-1'
import { lesson32 } from './lesson-3-2'
import { lesson33 } from './lesson-3-3'
import { lesson34 } from './lesson-3-4'
import { station2ReviewMakers } from './banks/station2Review'
import { station3ReviewMakers } from './banks/station3Review'
import { makeMixedReviewQuestion } from './banks/mixed'

const station2Review: ExamConfig = {
  id: 'review-st2',
  title: ' اختبار مراجعة: القراءة والفهم',
  emoji: '📝',
  count: 16,
  passPercent: 70,
  makers: station2ReviewMakers,
}

const station3Review: ExamConfig = {
  id: 'review-st3',
  title: ' اختبار مراجعة: الإملاء',
  emoji: '📝',
  count: 16,
  passPercent: 70,
  makers: station3ReviewMakers,
}

/** يشمل المحطات ١ و٢ و٣ (ص١١–٨٤). مولّد المحطة ١ المختلط يتكرر لتوازن التوزيع */
const midterm1: ExamConfig = {
  id: 'midterm-s1',
  title: 'اختبار منتصف الفصل الدراسي الأول',
  emoji: '🏫',
  count: 30,
  passPercent: 60,
  strict: true,
  lockHours: 24,
  makers: [
    ...Array.from({ length: 5 }, () => makeMixedReviewQuestion),
    ...station2ReviewMakers,
    ...station3ReviewMakers,
  ],
}

export const semesters: Semester[] = [
  {
    id: 's1',
    title: 'الفصل الدراسي الأول',
    emoji: '🌙',
    midterm: midterm1,
    units: [
      {
        id: 'u1',
        title: 'قدوات ومثل عليا',
        stations: [
          { id: 'st1', title: 'التهيئة', emoji: '🧭', pages: [11, 27], lessons: [lesson11, lesson12, lesson13, lesson14, lesson15, lesson16, lesson17, lesson18, lesson19] },
          { id: 'st2', title: 'القراءة والفهم', emoji: '📖', pages: [28, 64], lessons: [lesson21, lesson22, lesson23, lesson24, lesson25, lesson26], review: station2Review },
          { id: 'st3', title: 'الإملاء', emoji: '✍️', pages: [65, 84], lessons: [lesson31, lesson32, lesson33, lesson34], review: station3Review },
          { id: 'st4', title: 'النحو والصرف والخط', emoji: '🧩', pages: [85, 115], lessons: [] },
          { id: 'st5', title: 'الشعر والكتابة والتحدث', emoji: '🎤', pages: [116, 155], lessons: [] },
        ],
      },
    ],
  },
]

export const allLessons: Lesson[] = semesters.flatMap((s) =>
  s.units.flatMap((u) => u.stations.flatMap((st) => st.lessons)),
)

export function findLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id)
}

export function findExam(id: string): ExamConfig | undefined {
  for (const s of semesters) {
    for (const x of [s.midterm, s.final]) if (x?.id === id) return x
    for (const u of s.units)
      for (const st of u.stations) if (st.review?.id === id) return st.review
  }
  return undefined
}