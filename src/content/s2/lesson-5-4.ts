import type { Block, Lesson } from '../../types'
import {
  INSTR_TEXT,
  INSTR_TITLE,
  instrFieldSort,
  instrTraitSort,
  instructionPassageQuestions,
  makeInstructionFieldQuestion,
  makeInstructionTraitQuestion,
} from './banks/instruction'

export const s2Lesson54: Lesson = {
  id: 's2-5-4',
  title: 'بنية النص الإرشادي',
  emoji: '📋',
  blocks: [
    {
      type: 'say',
      emoji: '🧭',
      text: 'كل مرة بيقلك أحد «اغسل إيديك» أو «اربط الحزام»، هاد **إرشاد**!\n**النص الإرشادي:** توجيهات وتعليمات بنقدّمها للآخرين، وبتختلف حسب **مجالها**: صحية، مرورية، دينية...',
    },
    {
      type: 'say',
      emoji: '📦',
      text: 'النص الإرشادي بيجي بصور متعددة: **نشرة** من صفحة واحدة، أو **مطوية**، أو **كُتيّب**.',
    },
    { type: 'widget', widget: 'sort', data: instrFieldSort },
    { type: 'practice', title: 'تدريب: مجال الإرشاد 🧭', count: 4, make: makeInstructionFieldQuestion },
    {
      type: 'reveal',
      title: 'خصائص النص الإرشادي ⭐',
      cards: [
        { front: 'العنوان', back: 'بخط **بارز**، وفيه كلمات **مؤثرة** تجذب القارئ.' },
        { front: 'البداية', back: 'تبدأ بـ**جملة محورية**، مثل: «إذا أردت أن... فاتّبع الخطوات الآتية».' },
        { front: 'الأسلوب', back: 'تعليمات **واضحة**، في **جمل قصيرة**، مع **التعليل** والتفصيل، وفيها عبارات **مؤثرة**.' },
        { front: 'الصور', back: 'ترافقها **صور أو رسوم** لمزيد من الإيضاح والتأثير.' },
        { front: 'التنظيم', back: 'تُكتب في **خطوات أو نقاط**، قبل كل نقطة **شرطة (-)** أو **نجمة (*)** أو **دائرة (●)**، وبترتيب مناسب.' },
      ],
    },
    { type: 'say', emoji: '📖', text: 'اقرئي هالنص الإرشادي وطبّقي عليه الخصائص:' },
    { type: 'passage', title: INSTR_TITLE, text: INSTR_TEXT },
    ...instructionPassageQuestions().map((question): Block => ({ type: 'quiz', question })),
    { type: 'widget', widget: 'sort', data: instrTraitSort },
    { type: 'practice', title: 'تدريب: خصائص النص الإرشادي ⭐', count: 4, make: makeInstructionTraitQuestion },
    {
      type: 'reveal',
      title: 'أنشطة بدون تصحيح آلي 📝',
      cards: [
        { front: 'صور أخرى', back: 'فكّري: ما الصور الأخرى التي يأتي فيها النص الإرشادي غير النشرة والمطوية والكتيب؟' },
        { front: 'نص تخزين الأدوية', back: 'اقرئي النص الإرشادي «كيف تُخزَّن الأدوية بطريقة صحيحة؟» في كتابك، واقترحي عنواناً آخر فيه كلمات مؤثرة، وحدّدي الجملة المحورية، واصنعي جملة محورية من إنشائك.' },
        { front: 'نص الوصايا الخمس', back: 'اقرئي نص «الوصايا الخمس لأسنان صحية» بكتابك، وأجيبي: ما الهدف من الإرشادات؟ وما علاقتها بالصور المرافقة؟ وابحثي عن أسباب تسوس الأسنان ومكافحته.' },
      ],
    },
    {
      type: 'say',
      emoji: '🎯',
      text: '**خلاصة الدرس**\n١. النص الإرشادي: **توجيهات وتعليمات** للآخرين.\n٢. مجالاته: صحية، مرورية، دينية.\n٣. خصائصه: عنوان بارز، جملة محورية، جمل قصيرة مع تعليل، صور، رمز قبل كل نقطة، ترتيب.\n٤. بيجي: نشرة أو مطوية أو كتيب. 💪',
    },
  ],
}