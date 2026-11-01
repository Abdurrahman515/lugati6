import type { Lesson } from '../types'
import { INTERVIEW_SORT, makeInterviewRoleQuestion, oralQuestion } from './banks/oral'

export const lesson58: Lesson = {
  id: '5-8',
  title: 'التواصل الشفهي: إجراء مقابلة',
  emoji: '🎙️',
  blocks: [
    {
      type: 'say',
      emoji: '🎙️',
      text: 'تخيّلي إنك **صحفية** المدرسة وبدك تعملي **مقابلة** مع مسؤول النادي التقني! 📰\nالمقابلة حوار منظّم بين **محاور** و**ضيف**.',
    },
    {
      type: 'reveal',
      title: 'أجزاء المقابلة 🧩',
      cards: [
        { front: '١. السلام والتعريف', back: 'يبدأ المحاور بـ**السلام** ويعرّف بنفسه.' },
        { front: '٢. الاستئذان', back: 'يطلب **الإذن** بإجراء المقابلة.' },
        { front: '٣. الأسئلة', back: 'يسأل **أسئلة** من صلب الموضوع، ويجيب الضيف.' },
        { front: '٤. الشكر', back: 'يشكر المحاور الضيف على **وقته وإجاباته**.' },
      ],
    },
    { type: 'quiz', question: oralQuestion('interviewOrder') },
    { type: 'quiz', question: oralQuestion('who') },
    { type: 'widget', widget: 'sort', data: INTERVIEW_SORT },
    { type: 'practice', title: 'تدريب متجدّد: من يقول هذه العبارة؟ 🎲', count: 6, make: makeInterviewRoleQuestion },
    {
      type: 'say',
      emoji: '🧱',
      text: 'عناصر بتساعدك تبني أسئلة المقابلة عن **التقنية في المدرسة** (ص١٥٥): دخول التقنية إلى المدرسة، أهم الأجهزة، خبراء التقنية، جهود الدولة، المشكلات التقنية، النصائح، المنجزات، وتوظيف **منصة مدرستي** في التعليم عن بُعد.',
    },
    { type: 'quiz', question: oralQuestion('relevant') },
    {
      type: 'say',
      emoji: '✏️',
      text: '**دورك بالصوت!** (ما بيصحّحها التطبيق):\n١. أكمل المقابلة (ص١٥٤) مع من بجواري بعدة أسئلة وأجوبة، ثم نمثّلها أمام الصف.\n٢. أستعين بعناصر ص١٥٥ في بناء الحوار 🎬',
    },
    {
      type: 'say',
      emoji: '🎯',
      text: '**خلاصة الدرس**\nالمقابلة: **سلام ← تعريف ← استئذان ← أسئلة ← شكر**.\nالمحاور بيسأل، والضيف بيجيب. والأسئلة لازم تكون من صلب الموضوع! 💪',
    },
  ],
}