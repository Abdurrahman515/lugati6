import type { Question } from '../../../types'
import type { SortBucket, SortItem } from '../../../widgets/SortWidget'
import { choiceQ, makeSortItems } from '../../helpers'
import { pick, shuffled } from '../../../lib/random'

/* ───────── الجدول الذاتي ───────── */
const COLS = [
  { id: 'c1', label: 'العمود ١: ما أعرفه', d: 'ما أعرفه مسبقاً قبل القراءة' },
  { id: 'c2', label: 'العمود ٢: ما أريد معرفته', d: 'ما أريد أو أتوقع أن أتعلمه قبل القراءة' },
  { id: 'c3', label: 'العمود ٣: ما تعلّمته', d: 'ما تعلمته بعد قراءة النص' },
  { id: 'c4', label: 'العمود ٤: ما أريد معرفته أيضاً', d: 'ما أريد معرفته ولم يرد في النص' },
]
export const JADWAL_BUCKETS: SortBucket[] = COLS.map((c) => ({ id: c.id, label: c.label }))

const JADWAL_ROWS: [string, string][] = [
  ['أكتب كل ما أعرفه عن الموضوع في قائمة', 'c1'],
  ['أتبادل معلوماتي السابقة مع باقي المجموعات', 'c1'],
  ['أحدد ما أريد معرفته عن الموضوع', 'c2'],
  ['أكتب ما أتوقع أن أتعلمه من النص', 'c2'],
  ['أقرأ النص قراءة صامتة بفهم وتركيز', 'c3'],
  ['أدوّن ما تعلمته بعد قراءة النص', 'c3'],
  ['أكتب ما أريد معرفته ولم يرد في النص', 'c4'],
  ['أناقش معلومات أريدها عن الصحة البيئية والمهنية', 'c4'],
]
const colDesc = (id: string) => COLS.find((c) => c.id === id)!.d

export const jadwalSortItems = (): SortItem[] =>
  makeSortItems(
    JADWAL_BUCKETS,
    JADWAL_ROWS.map(([t, c]) => [t, c, `هاي خطوة «${colDesc(c)}».`] as [string, string, string]),
  )

export function makeJadwalQuestion(): Question {
  const [text, id] = pick(JADWAL_ROWS)
  const right = COLS.find((c) => c.id === id)!
  return choiceQ(
    `s2-jadwal-${text}`,
    `في استراتيجية الجدول الذاتي: «${text}»\nفي أي عمود نكتبها؟`,
    [right.label, `صح! هاد العمود لـ«${right.d}».`],
    COLS.filter((c) => c.id !== id).map((c) => [c.label, `هاد العمود لـ«${c.d}»، والخطوة هون من «${right.d}».`] as [string, string]),
  )
}

/* ───────── أنواع الصحة (نص «صحتنا») ───────── */
export const HEALTH_BUCKETS: SortBucket[] = [
  { id: 'body', label: 'الصحة البدنية', emoji: '💪' },
  { id: 'soul', label: 'الصحة النفسية', emoji: '🌙' },
  { id: 'mind', label: 'الصحة العقلية', emoji: '🧠' },
  { id: 'social', label: 'الصحة الاجتماعية', emoji: '🤝' },
]
const HEALTH_ROWS: [string, string][] = [
  ['شرب كميات مناسبة من الماء', 'body'],
  ['النوم لساعات كافية', 'body'],
  ['تنظيف الأسنان وتقليم الأظافر', 'body'],
  ['الصلاة في وقتها', 'soul'],
  ['قراءة القرآن الكريم', 'soul'],
  ['حسن الظن بالله', 'soul'],
  ['التفكير في الأمور الإيجابية', 'mind'],
  ['ممارسة هواية مفيدة', 'mind'],
  ['اختيار الصحبة الصالحة', 'social'],
  ['التعاطف والتراحم بين الناس', 'social'],
]
const hLabel = (id: string) => HEALTH_BUCKETS.find((b) => b.id === id)!.label

export const healthSortItems = (): SortItem[] =>
  makeSortItems(HEALTH_BUCKETS, HEALTH_ROWS.map(([t, b]) => [t, b, `«${t}» من ${hLabel(b)} كما ورد في نص «صحتنا».`] as [string, string, string]))

export function makeHealthTypeQuestion(): Question {
  const [text, id] = pick(HEALTH_ROWS)
  const wrongs = shuffled(HEALTH_BUCKETS.filter((b) => b.id !== id)).slice(0, 2)
  return choiceQ(
    `s2-htype-${text}`,
    `«${text}» تدخل في أي نوع من أنواع الصحة؟`,
    [hLabel(id), `صح! النص ذكرها ضمن ${hLabel(id)}.`],
    wrongs.map((b) => [b.label, `«${text}» مش من ${b.label}، هي من ${hLabel(id)}.`] as [string, string]),
  )
}

/* ───────── السؤال المتبادل ───────── */
const QW: Record<string, string> = {
  'مَنْ': 'شخص',
  'مَاذَا': 'شيء',
  'أَيْنَ': 'مكان',
  'مَتَى': 'زمن',
  'لِمَ': 'سبب',
  'كَيْفَ': 'طريقة',
  'كَمْ': 'عدد',
}

const QFACTS: { fact: string; cases: [string, string][] }[] = [
  { fact: 'ذَهَبَتْ سَلْمَى مَعَ أَبِيهَا إِلَى المُسْتَشْفَى صَبَاحًا.', cases: [['سَلْمَى', 'مَنْ'], ['إِلَى المُسْتَشْفَى', 'أَيْنَ'], ['صَبَاحًا', 'مَتَى']] },
  { fact: 'اشْتَرَتْ أُمِّي خَمْسَ عُلَبٍ.', cases: [['أُمِّي', 'مَنْ'], ['خَمْسَ', 'كَمْ']] },
  { fact: 'غَسَلَ أَحْمَدُ يَدَيْهِ بِالمَاءِ وَالصَّابُونِ لِيَحْمِيَ نَفْسَهُ مِنَ الجَرَاثِيمِ.', cases: [['أَحْمَدُ', 'مَنْ'], ['بِالمَاءِ وَالصَّابُونِ', 'كَيْفَ'], ['لِيَحْمِيَ نَفْسَهُ مِنَ الجَرَاثِيمِ', 'لِمَ']] },
  { fact: 'شَرِبَتْ نُورَةُ كُوبَ لَبَنٍ بَعْدَ الغَدَاءِ فِي المَطْبَخِ.', cases: [['نُورَةُ', 'مَنْ'], ['كُوبَ لَبَنٍ', 'مَاذَا'], ['بَعْدَ الغَدَاءِ', 'مَتَى'], ['فِي المَطْبَخِ', 'أَيْنَ']] },
]

export function makeQuestionWordQuestion(): Question {
  const f = pick(QFACTS)
  const [ans, right] = pick(f.cases)
  const wrongs = shuffled(Object.keys(QW).filter((w) => w !== right)).slice(0, 2)
  return choiceQ(
    `s2-qword-${f.fact}-${right}`,
    `الجملة: «${f.fact}»\nأي أداة سؤال تناسب الجواب «${ans}»؟`,
    [right, `صح! «${right}» بنسأل بها عن ${QW[right]}، و«${ans}» هو ${QW[right]}.`],
    wrongs.map((w) => [w, `«${w}» بنسأل بها عن ${QW[w]}، لكن «${ans}» هو ${QW[right]}.`] as [string, string]),
  )
}