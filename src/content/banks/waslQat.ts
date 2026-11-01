import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import { pick } from '../../lib/random'
import { choiceQ, makeSortItems } from '../helpers'

export type WaslKind = 'wasl' | 'qat'
export type WaslCat = 'noun7' | 'nounOther' | 'particle' | 'al' | 'verb5' | 'verb6' | 'imp3' | 'verb4' | 'verb3'

export interface WaslWord {
  /** الكلمة مكتوبة كتابة صحيحة بحركاتها */
  spelled: string
  cat: WaslCat
  kind: WaslKind
}

const KIND_OF: Record<WaslCat, WaslKind> = {
  noun7: 'wasl',
  nounOther: 'qat',
  particle: 'qat',
  al: 'wasl',
  verb5: 'wasl',
  verb6: 'wasl',
  imp3: 'wasl',
  verb4: 'qat',
  verb3: 'qat',
}

const group = (cat: WaslCat, words: string[]): WaslWord[] =>
  words.map((spelled) => ({ spelled, cat, kind: KIND_OF[cat] }))

/** أفعال الخماسي والسداسي لا تدخل فيها مصادر الأفعال: القاعدة هنا بحسب كتاب الصف */
export const WASL_BANK: WaslWord[] = [
  ...group('noun7', ['اسْمٌ', 'ابْنٌ', 'ابْنَةٌ', 'امْرُؤٌ', 'امْرَأَةٌ', 'اثْنَانِ', 'اثْنَتَانِ']),
  ...group('nounOther', [
    'أَحْمَدُ', 'إِيثَارٌ', 'أُمٌّ', 'أَخٌ', 'إِبْرَاهِيمُ', 'أَرْضٌ',
    'إِنْسَانٌ', 'أَسَدٌ', 'أُسْتَاذٌ', 'أُسْرَةٌ', 'إِجَازَةٌ', 'أَمَلٌ',
  ]),
  ...group('particle', ['أَنْ', 'أَوْ', 'إِذَا', 'إِنَّ', 'أَمْ', 'إِذْ']),
  ...group('al', ['الكِتَابُ', 'القَلَمُ', 'المَدْرَسَةُ', 'الشَّمْسُ', 'البَابُ', 'الوَطَنُ', 'الحَدِيقَةُ']),
  ...group('verb5', [
    'انْتَظَرَ', 'انْطَلَقَ', 'اجْتَمَعَ', 'ابْتَسَمَ', 'احْتَارَ', 'اقْتَرَبَ',
    'انْتَبَهَ', 'اكْتَشَفَ', 'ارْتَفَعَ', 'انْتَظِرْ', 'اقْتَرِبْ',
  ]),
  ...group('verb6', [
    'اسْتَفْهَمَ', 'اسْتَغْفَرَ', 'اسْتَخْرَجَ', 'اسْتَعْمَلَ', 'اسْتَقْبَلَ',
    'اسْتَخْدَمَ', 'اسْتَكْشَفَ', 'اسْتَفْهِمْ', 'اسْتَغْفِرْ',
  ]),
  ...group('imp3', [
    'اكْتُبْ', 'اذْهَبْ', 'اجْلِسْ', 'اقْرَأْ', 'ادْخُلْ', 'افْتَحْ',
    'اسْمَعْ', 'ارْسُمْ', 'اشْرَبْ', 'اخْرُجْ', 'اشْكُرْ',
  ]),
  ...group('verb4', [
    'أَسْلَمَ', 'أَكْرَمَ', 'أَنْزَلَ', 'أَرْسَلَ', 'أَخْرَجَ', 'أَعْطَى',
    'أَضْحَكَ', 'أَكْمَلَ', 'أَخْبَرَ', 'أَحْسَنَ', 'أَسْلِمْ', 'أَكْرِمْ', 'أَرْسِلْ',
  ]),
  ...group('verb3', ['أَكَلَ', 'أَخَذَ', 'أَمَرَ', 'أَمِنَ', 'أَسَرَ', 'أَذِنَ', 'أَسِفَ']),
]

export function byWasl(spelled: string): WaslWord {
  const found = WASL_BANK.find((b) => b.spelled === spelled)
  if (!found) throw new Error(`الكلمة غير موجودة في بنك الوصل والقطع: ${spelled}`)
  return found
}

/** الكلمة كما بالكتاب: ألف عادية في أولها بلا رأس همزة، حتى لا تكشف الجواب */
export const plainOf = (spelled: string): string => spelled.replace(/^[أإآا][\u064B-\u0652]?/, 'ا')

const KIND_NAME: Record<WaslKind, string> = { wasl: 'همزة وصل', qat: 'همزة قطع' }
const KIND_TEXT: Record<WaslKind, string> = { wasl: 'همزة وصل 🔗', qat: 'همزة قطع ✂️' }

const RULE: Record<WaslCat, string> = {
  noun7: 'من الأسماء السبعة اللي همزتها وصل (اسم، ابن، ابنة، امرؤ، امرأة، اثنان، اثنتان)',
  nounOther: 'اسم، وكل الأسماء همزتها قطع ما عدا الأسماء السبعة (اسم، ابن، ابنة، امرؤ، امرأة، اثنان، اثنتان)',
  particle: 'حرف، والحروف كلها همزتها قطع ما عدا (ال) التعريف',
  al: '(ال) التعريف، وهمزتها وصل',
  verb5: 'فعل خماسي (خمسة أحرف)، وهمزة الخماسي وصل ماضياً كان أو أمراً',
  verb6: 'فعل سداسي (ستة أحرف)، وهمزة السداسي وصل ماضياً كان أو أمراً',
  imp3: 'فعل أمر من فعل ثلاثي، وهمزة أمر الثلاثي وصل',
  verb4: 'فعل رباعي (أربعة أحرف)، وهمزة الرباعي قطع ماضياً كان أو أمراً',
  verb3: 'فعل ماضٍ ثلاثي، وهمزة الماضي الثلاثي قطع (بعكس أمر الثلاثي)',
}

const reasonOf = (w: WaslWord): string => `«${plainOf(w.spelled)}» ← ${RULE[w.cat]}.`

const MOVE_AR: Record<string, string> = { '\u064E': 'مفتوحة', '\u064F': 'مضمومة', '\u0650': 'مكسورة' }

export function waslKindQuestion(w: WaslWord): Question {
  const other: WaslKind = w.kind === 'wasl' ? 'qat' : 'wasl'
  const reason = reasonOf(w)
  return choiceQ(
    `wasl-kind-${w.spelled}`,
    `الهمزة في أول كلمة **${plainOf(w.spelled)}** هي:`,
    [KIND_TEXT[w.kind], `${reason} إذن همزتها ${KIND_NAME[w.kind]}.`],
    [[KIND_TEXT[other], `${reason} يعني همزتها ${KIND_NAME[w.kind]}، مش ${KIND_NAME[other]}.`]],
  )
}

const LETTER_TEXT: Record<string, string> = {
  'ا': 'ا (ألف بلا همزة)',
  'أ': 'أ (همزة فوق الألف)',
  'إ': 'إ (همزة تحت الألف)',
}

export function waslLetterQuestion(w: WaslWord): Question {
  const mark = w.spelled.charAt(0)
  const move = MOVE_AR[w.spelled.charAt(1)] ?? ''
  const plain = plainOf(w.spelled)
  const reason = reasonOf(w)
  const rightWhy =
    mark === 'ا'
      ? `${reason} وهمزة الوصل ما بتنكتب بصورة همزة، بتنكتب ألفاً عادية (ا).`
      : mark === 'أ'
        ? `${reason} وهمزتها ${move}، والمفتوحة أو المضمومة بتنكتب فوق الألف (أ).`
        : `${reason} وهمزتها مكسورة، والمكسورة بتنكتب تحت الألف (إ).`
  const wrongWhy = (m: string): string => {
    if (mark === 'ا') return `همزة الوصل ما بتنكتب بصورة همزة (أ أو إ). ${reason}`
    if (m === 'ا') return `${reason} وهمزة القطع لازم تنكتب بصورة همزة (أ أو إ)، مش ألفاً عادية.`
    if (mark === 'أ') return `همزة «${plain}» ${move}، مش مكسورة، والمكسورة وحدها بتنكتب تحت الألف (إ). فهي (أ).`
    return `همزة «${plain}» مكسورة، والمكسورة بتنكتب تحت الألف (إ) مش فوقها.`
  }
  const wrongs = ['ا', 'أ', 'إ']
    .filter((m) => m !== mark)
    .map((m): [string, string] => [LETTER_TEXT[m], wrongWhy(m)])
  return choiceQ(
    `wasl-letter-${w.spelled}`,
    `كيف تُكتب الهمزة في أول **${plain}** كتابة صحيحة؟`,
    [LETTER_TEXT[mark], rightWhy],
    wrongs,
  )
}

export function makeWaslQuestion(): Question {
  const w = pick(WASL_BANK)
  return Math.random() < 0.6 ? waslKindQuestion(w) : waslLetterQuestion(w)
}

export const WASL_BUCKETS = [
  { id: 'wasl', label: 'همزة وصل', emoji: '🔗' },
  { id: 'qat', label: 'همزة قطع', emoji: '✂️' },
]

export function waslSortItems(list: string[]): SortItem[] {
  return makeSortItems(
    WASL_BUCKETS,
    list.map((sp): [string, string, string] => {
      const w = byWasl(sp)
      return [plainOf(sp), w.kind, `${reasonOf(w)} إذن همزتها ${KIND_NAME[w.kind]}.`]
    }),
  )
}