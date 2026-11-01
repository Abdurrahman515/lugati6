import type { Block, Lesson } from '../types'
import {
  PASSAGE_SHORE,
  PASSAGE_ZAID,
  makePassageQuestion,
  type PassageSet,
} from './banks/spellingPassages'

const section = (set: PassageSet): Block[] => [
  { type: 'passage', title: set.passage.title, text: set.passage.text },
  ...set.questions.map((question): Block => ({ type: 'quiz', question })),
]

export const lesson34: Lesson = {
  id: '3-4',
  title: 'نص وأسئلته: تدريب شامل على الإملاء',
  emoji: '📜',
  blocks: [
    {
      type: 'say',
      emoji: '📜',
      text: 'بالمدرسة كتير أسئلة بتجي **على نص**: بيعطوكِ نص وبيسألوكِ عن كلماته. هاي مهارة بتجمّع كل اللي تعلّمتيه بالإملاء! 💪',
    },
    {
      type: 'say',
      emoji: '🧠',
      text: '**خطة الحل:**\n١. اقرئي النص مرة بهدوء.\n٢. لاقي **الكلمة** اللي بيسألوا عنها بالنص.\n٣. حدّدي نوع الهمزة: أول الكلمة؟ وسطها؟ آخرها؟\n٤. طبّقي القاعدة المناسبة (وصل/قطع، أو الحركات، أو حركة ما قبلها).',
    },
    ...section(PASSAGE_SHORE),
    {
      type: 'say',
      emoji: '🌟',
      text: 'ممتاز! نص تاني، وفيه كمان همزة (ابن) 👇',
    },
    ...section(PASSAGE_ZAID),
    { type: 'practice', title: 'تدريب متجدّد: نصوص وأسئلتها 🎲', count: 6, make: makePassageQuestion },
    {
      type: 'say',
      emoji: '🎯',
      text: '**خلاصة الدرس**\nسؤال النص: اقرئي ثم لاقي الكلمة ثم حدّدي موضع الهمزة ثم طبّقي قاعدتها.\nأول الكلمة ← وصل/قطع. وسطها ← قوة الحركات. آخرها ← حركة الحرف قبلها 💪',
    },
  ],
}