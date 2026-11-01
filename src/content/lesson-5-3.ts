import type { Lesson } from '../types'
import { PASSAGE_BEE } from './banks/station5Passages'
import { makeSummaryKeepQuestion, sumQuestion } from './banks/summary'

export const lesson53: Lesson = {
  id: '5-3',
  title: 'التلخيص: ما هو وما خصائصه؟',
  emoji: '✂️',
  blocks: [
    {
      type: 'say',
      emoji: '✂️',
      text: 'لو بدك تحكي لصديقتك عن كتاب كامل بدقيقتين، شو بتعملي؟ بتختاري **أهم الأفكار** وبتتركي الباقي! هذا هو **التلخيص** 😍',
    },
    {
      type: 'reveal',
      title: 'خصائص التلخيص 🔑',
      cards: [
        { front: '١', back: 'يتضمّن **الأفكار الرئيسة** للنص الأصلي.' },
        { front: '٢', back: 'أصغر **حجماً** من النص الأصلي.' },
        {
          front: '٣',
          back: 'يخلو من **الألفاظ المكررة** و**التشبيهات** و**الصفات غير الضرورية** و**الأمثلة والأدلة والتوضيح**.',
        },
        { front: '٤', back: 'جمله **تختلف** عن جمل النص الأصلي، لأنه يُكتب **بأسلوب من لخّص**.' },
      ],
    },
    { type: 'quiz', question: sumQuestion('what') },
    { type: 'quiz', question: sumQuestion('size') },
    { type: 'quiz', question: sumQuestion('freeOf') },
    { type: 'quiz', question: sumQuestion('style') },
    { type: 'quiz', question: sumQuestion('meaning') },
    {
      type: 'say',
      emoji: '🐝',
      text: 'خلّينا نجرّب على نص قصير. اقرئيه وانتبهي للفقرات (الفقرة بتبدأ بفراغ صغير):',
    },
    { type: 'passage', title: PASSAGE_BEE.passage.title, text: PASSAGE_BEE.passage.text },
    { type: 'quiz', question: PASSAGE_BEE.questions[0] },
    { type: 'quiz', question: PASSAGE_BEE.questions[3] },
    {
      type: 'reveal',
      title: 'استراتيجية تدوين الملحوظات 📝',
      cards: [
        { front: 'تدوين الأفكار', back: 'ندوّن **الأفكار الرئيسة**.' },
        { front: 'الخطوط', back: 'نضع **خطاً** تحت التعريفات، وخطاً تحت الكلمات اللي **ما فهمناها**.' },
        {
          front: 'الاختصارات',
          back: '**ف** = فكرة\n**م** = مثال\n**ت** = توفّي\n**هـ** = هجرية',
        },
        { front: 'الأسئلة والعناوين', back: 'ندوّن **أسئلة** حول الموضوع، ونضع **عنواناً مختصراً** لكل فقرة.' },
        { front: 'المخطّطات', back: 'نستخدم **المخطّطات والخرائط الذهنية**.' },
      ],
    },
    { type: 'quiz', question: sumQuestion('symTa') },
    { type: 'quiz', question: sumQuestion('symMeem') },
    { type: 'practice', title: 'تدريب متجدّد: أبقيها ولا أحذفها؟ 🎲', count: 8, make: makeSummaryKeepQuestion },
    {
      type: 'say',
      emoji: '✏️',
      text: '**دورك بالدفتر** (ما بيصحّحها التطبيق):\n١. نقرأ نص «الإمام أبو حنيفة والإسكافي» ونجيب عن أسئلة ص١٣١، ونعدّ فقراته (ص١٣١–١٣٢).\n٢. نقارن بين نص «المركز الوطني للالتزام البيئي» وتلخيصه، ونجيب شفهياً (ص١٣٣–١٣٤).\n٣. نقرأ نص «تحية الإسلام» وتلخيصه، ونتحقق أنه ربط للجمل بأدوات مناسبة (ص١٣٥–١٣٦).\n٤. التفكير الإبداعي: لو كنتِ مكان أبي حنيفة، كيف ستتصرفين؟ (ص١٣٢) 💡',
    },
    {
      type: 'say',
      emoji: '🎯',
      text: '**خلاصة الدرس**\nالتلخيص = **الأفكار الرئيسة** بحجم **أصغر** وبأسلوبي أنا.\nبنحذف: التكرار، التشبيه، الأمثلة، الصفات الزائدة.\nوبندوّن ملحوظاتنا باختصارات: **ف، م، ت، هـ** 💪',
    },
  ],
}