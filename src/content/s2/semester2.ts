import type { ExamConfig, Semester } from '../../types'
import { spread } from '../../lib/spread'
import { s2Lesson11 } from './lesson-1-1'
import { s2Lesson12 } from './lesson-1-2'
import { s2Lesson13 } from './lesson-1-3'
import { s2Lesson14 } from './lesson-1-4'
import { s2Lesson15 } from './lesson-1-5'
import { s2Lesson16 } from './lesson-1-6'
import { s2Lesson17 } from './lesson-1-7'
import { s2Lesson21 } from './lesson-2-1'
import { s2Lesson22 } from './lesson-2-2'
import { s2Lesson23 } from './lesson-2-3'
import { s2Lesson24 } from './lesson-2-4'
import { s2Lesson25 } from './lesson-2-5'
import { s2Lesson26 } from './lesson-2-6'
import { s2Lesson27 } from './lesson-2-7'
import { s2Lesson31 } from './lesson-3-1'
import { s2Lesson32 } from './lesson-3-2'
import { s2Lesson33 } from './lesson-3-3'
import { s2Station2ReviewMakers } from './banks/station2Review'
import { s2Station3ReviewMakers } from './banks/station3Review'
import { makeTanweenKindQuestion } from './banks/tanween'
import { makeMizanQuestion } from './banks/mizan'
import { makeMixedReviewQuestion } from '../banks/mixed'
import { makeNawasikhMixQuestion } from '../banks/nawasikh'
import { s2Lesson41 } from './lesson-4-1'
import { s2Lesson42 } from './lesson-4-2'
import { s2Lesson43 } from './lesson-4-3'
import { s2Lesson44 } from './lesson-4-4'
import { s2Lesson45 } from './lesson-4-5'
import { s2Lesson46 } from './lesson-4-6'
import { s2Station4ReviewMakers } from './banks/station4Review'
import { s2Lesson51 } from './lesson-5-1'
import { s2Lesson52 } from './lesson-5-2'
import { s2Lesson53 } from './lesson-5-3'
import { s2Lesson54 } from './lesson-5-4'
import { s2Lesson55 } from './lesson-5-5'
import { s2Lesson56 } from './lesson-5-6'
import { s2Lesson57 } from './lesson-5-7'
import { s2Lesson58 } from './lesson-5-8'
import { s2Station5ReviewMakers } from './banks/station5Review'

const s2Station2Review: ExamConfig = {
  id: 'review-s2-st2',
  title: ' اختبار مراجعة: القراءة والفهم',
  emoji: '📝',
  count: 16,
  passPercent: 70,
  makers: s2Station2ReviewMakers,
}

const s2Station3Review: ExamConfig = {
  id: 'review-s2-st3',
  title: ' اختبار مراجعة: الإملاء',
  emoji: '📝',
  count: 16,
  passPercent: 70,
  makers: s2Station3ReviewMakers,
}

const s2Station4Review: ExamConfig = {
  id: 'review-s2-st4',
  title: ' اختبار مراجعة: النحو والصرف والخط',
  emoji: '📝',
  count: 16,
  passPercent: 70,
  makers: s2Station4ReviewMakers,
}

const s2Station5Review: ExamConfig = {
  id: 'review-s2-st5',
  title: ' اختبار مراجعة: الشعر وبنية النص والتواصل',
  emoji: '📝',
  count: 16,
  passPercent: 70,
  makers: s2Station5ReviewMakers,
}

/** مولّدات المحطة ١ (التهيئة): المختلط، والميزان الصرفي، وتنوين المقصور والمنقوص والممدود، والنواسخ (s2-1-6) */
const s2Station1Makers = [makeMixedReviewQuestion, makeMizanQuestion, makeTanweenKindQuestion, makeNawasikhMixQuestion]

/**
 * يشمل المحطات ١–٣ (ص١١–٨٨). أوزان الخانات (اجتهاد): ٨ للمحطة ١ و١٠ للمحطة ٢ و١٢ للمحطة ٣.
 * المحطة ١: أربعة مولّدات بخانتين لكل منها.
 */
const s2Midterm: ExamConfig = {
  id: 'midterm-s2',
  title: 'اختبار منتصف الفصل الدراسي الثاني',
  emoji: '🏫',
  count: 30,
  passPercent: 60,
  strict: true,
  lockHours: 24,
  makers: [
    ...spread(s2Station1Makers, 8),
    ...spread(s2Station2ReviewMakers, 10),
    ...spread(s2Station3ReviewMakers, 12),
  ],
}

/**
 * يشمل المحطات ١–٥ (ص١١–١٥٨). أوزان الخانات (اجتهاد، مجموعها ٦٠): ١٠ للمحطة ١ و١٢ للمحطة ٢ و١٢ للمحطة ٣ و١٤ للمحطة ٤ و١٢ للمحطة ٥.
 * يقابل اختبار الوحدة المطبوع (ص١٥٩–١٦٣): الشرط والمضارع والمصدر والألف اللينة وخط النسخ تغطيها مولّدات المحطات ٢–٤.
 */
const s2Final: ExamConfig = {
  id: 'final-s2',
  title: 'اختبار نهاية العام',
  emoji: '🎓',
  count: 60,
  passPercent: 60,
  strict: true,
  lockHours: 24,
  makers: [
    ...spread(s2Station1Makers, 10),
    ...spread(s2Station2ReviewMakers, 12),
    ...spread(s2Station3ReviewMakers, 12),
    ...spread(s2Station4ReviewMakers, 14),
    ...spread(s2Station5ReviewMakers, 12),
  ],
}

/** الفصل الدراسي الثاني: وحدة «الوعي الصحي والاجتماعي» (ترقيم الصفحات المطبوع). */
export const semester2: Semester = {
  id: 's2',
  title: 'الفصل الدراسي الثاني',
  emoji: '🌿',
  midterm: s2Midterm,
  final: s2Final,
  units: [
    {
      id: 'u2',
      title: 'الوعي الصحي والاجتماعي',
      stations: [
        { id: 'st1', title: 'التهيئة', emoji: '🧭', pages: [11, 23], lessons: [s2Lesson11, s2Lesson12, s2Lesson13, s2Lesson14, s2Lesson15, s2Lesson16, s2Lesson17] },
        { id: 'st2', title: 'القراءة والفهم', emoji: '📖', pages: [24, 64], lessons: [s2Lesson21, s2Lesson22, s2Lesson23, s2Lesson24, s2Lesson25, s2Lesson26, s2Lesson27], review: s2Station2Review },
        { id: 'st3', title: 'الإملاء', emoji: '✍️', pages: [65, 88], lessons: [s2Lesson31, s2Lesson32, s2Lesson33], review: s2Station3Review },
        { id: 'st4', title: 'النحو والصرف والخط', emoji: '🧩', pages: [89, 130], lessons: [s2Lesson41, s2Lesson42, s2Lesson43, s2Lesson44, s2Lesson45, s2Lesson46], review: s2Station4Review },
        { id: 'st5', title: 'الشعر وبنية النص والتواصل', emoji: '🎤', pages: [131, 158], lessons: [s2Lesson51, s2Lesson52, s2Lesson53, s2Lesson54, s2Lesson55, s2Lesson56, s2Lesson57, s2Lesson58], review: s2Station5Review },
      ],
    },
  ],
}