import type { Question } from '../../../types'
import type { SortBucket, SortItem } from '../../../widgets/SortWidget'
import { choiceQ, makeSortItems } from '../../helpers'
import { pick, shuffled } from '../../../lib/random'

/* ───────── النخلة الغذائية ───────── */
export const FOOD_BUCKETS: SortBucket[] = [
  { id: 'oil', label: 'الزيوت والسكريات', emoji: '🍬' },
  { id: 'meat', label: 'اللحوم والبقوليات', emoji: '🍗' },
  { id: 'milk', label: 'الحليب ومشتقاته', emoji: '🥛' },
  { id: 'fruit', label: 'الفواكه', emoji: '🍎' },
  { id: 'veg', label: 'الخضار', emoji: '🥕' },
  { id: 'grain', label: 'الحبوب والخبز', emoji: '🍞' },
  { id: 'water', label: 'الماء', emoji: '💧' },
]

const FOOD_ROWS: [string, string, string][] = [
  ['السكر', 'oil', 'السكريات بأصغر مجموعة بالنخلة، والمطلوب منها أقل كمية ممكنة.'],
  ['الحلويات', 'oil', 'الحلويات سكريات، فمكانها مجموعة الزيوت والسكريات.'],
  ['زيت الطبخ', 'oil', 'الزيوت مع السكريات بنفس المجموعة.'],
  ['لحم الدجاج', 'meat', 'الدجاج من مجموعة اللحوم والبقوليات.'],
  ['السمك', 'meat', 'السمك من مجموعة اللحوم والبقوليات.'],
  ['العدس', 'meat', 'العدس من البقوليات، وهي مع اللحوم بمجموعة وحدة.'],
  ['اللبن', 'milk', 'اللبن من مشتقات الحليب.'],
  ['الجبن', 'milk', 'الجبن من مشتقات الحليب.'],
  ['كوب الحليب', 'milk', 'الحليب هو اسم المجموعة نفسها.'],
  ['الموز', 'fruit', 'الموز فاكهة.'],
  ['البرتقال', 'fruit', 'البرتقال فاكهة.'],
  ['الخيار', 'veg', 'الخيار من الخضار.'],
  ['الجزر', 'veg', 'الجزر من الخضار.'],
  ['الخبز', 'grain', 'الخبز بمجموعة الحبوب والخبز، وهي أكبر مجموعة بالنخلة.'],
  ['الأرز', 'grain', 'الأرز من الحبوب.'],
  ['الذرة', 'grain', 'الذرة من الحبوب.'],
  ['كوب ماء', 'water', 'الماء مجموعة لحاله بآخر النخلة.'],
]

export const foodSortItems = (): SortItem[] => makeSortItems(FOOD_BUCKETS, FOOD_ROWS)

const foodLabel = (id: string) => FOOD_BUCKETS.find((b) => b.id === id)!.label

export function makeFoodGroupQuestion(): Question {
  const [text, id, why] = pick(FOOD_ROWS)
  const wrongs = shuffled(FOOD_BUCKETS.filter((b) => b.id !== id)).slice(0, 2)
  return choiceQ(
    `s2-food-${text}`,
    `«${text}» تنتمي إلى أي مجموعة في النخلة الغذائية؟`,
    [foodLabel(id), `صح! ${why}`],
    wrongs.map((b) => [b.label, `«${text}» مش من مجموعة «${b.label}». مكانها «${foodLabel(id)}».`] as [string, string]),
  )
}

/* ───────── مصطلحات الصحة ───────── */
const TERMS: [string, string][] = [
  ['الجرثومة', 'كائن صغير يعيش في كل الظروف، ويسبّب المرض إذا دخل جسم الإنسان.'],
  ['المرض المعدي', 'مرض ينتقل من إنسان مريض إلى غيره، ومن وسائل انتقاله السعال والعطاس.'],
  ['الفيروسات', 'مخلوقات مجهرية تدخل الخلايا وتعطّل عملها بعد أن تتكاثر بداخلها.'],
  ['المناعة', 'قوة يكتسبها الجسم تجعله غير قابل للإصابة بمرض من الأمراض.'],
  ['الوقاية الصحية', 'وسيلة لحماية أنفسنا من الكائنات الدقيقة التي تسبب الأمراض.'],
]

export function makeTermQuestion(): Question {
  const [term, def] = pick(TERMS)
  const others = shuffled(TERMS.filter((t) => t[0] !== term)).slice(0, 2)
  return choiceQ(
    `s2-term-${term}`,
    `ما المقصود بـ«${term}»؟`,
    [def, 'صح! هيك عرّفها الكتاب.'],
    others.map(([t, d]) => [d, `هاد تعريف «${t}» مش «${term}».`] as [string, string]),
  )
}

/* ───────── الأمراض ───────── */
const DISEASES: [string, string][] = [
  ['الجدري', 'فقاقيع مياه على الجسم تنفجر وتترك قروحاً داكنة'],
  ['الحصبة', 'احمرار وارتفاع حرارة الجسم عند الأطفال'],
  ['الملاريا', 'لدغة بعوضة تعيش في المستنقعات'],
  ['الإنفلونزا', 'سعال جاف وآلام في المفاصل والصدر'],
  ['الفطريات', 'بقع في الجسم ورائحة كريهة في القدم'],
]

export function makeDiseaseQuestion(): Question {
  const [name, trait] = pick(DISEASES)
  const others = shuffled(DISEASES.filter((d) => d[0] !== name)).slice(0, 2)
  return choiceQ(
    `s2-disease-${name}`,
    `أي مما يأتي يرتبط بهذه الصفة: «${trait}»؟`,
    [name, `صح! هي من علامات «${name}» حسب جدول الكتاب.`],
    others.map(([n, t]) => [n, `«${n}» ترتبط بـ«${t}»، مش بهالصفة.`] as [string, string]),
  )
}

export const makeHealthIntroQuestion = (): Question =>
  pick([makeFoodGroupQuestion, makeTermQuestion, makeDiseaseQuestion])()

/* ───────── أداتا تصنيف ───────── */
export const CAUSE_BUCKETS: SortBucket[] = [
  { id: 'virus', label: 'فيروس', emoji: '🦠' },
  { id: 'germ', label: 'جرثومة', emoji: '🧫' },
  { id: 'bug', label: 'بعوضة', emoji: '🦟' },
  { id: 'fungi', label: 'فطريات', emoji: '🍄' },
]
export const causeSortItems = (): SortItem[] =>
  makeSortItems(CAUSE_BUCKETS, [
    ['الجدري', 'virus', 'ينتقل بواسطة فيروس الجدري.'],
    ['الإنفلونزا', 'virus', 'عدوى تنتقل بواسطة فيروس.'],
    ['الحصبة', 'germ', 'الكتاب بيعتبرها مرضاً جرثومياً يصيب الأطفال.'],
    ['الملاريا', 'bug', 'بتصيب الجسم بعد لدغة بعوضة الملاريا.'],
    ['بقع الجلد ورائحة القدم الكريهة', 'fungi', 'بتسببها الفطريات اللي بتعيش على سطح الجلد.'],
  ])

export const ADAB_BUCKETS: SortBucket[] = [
  { id: 'patience', label: 'الصبر والاحتساب', emoji: '🤲' },
  { id: 'treat', label: 'التداوي', emoji: '💊' },
  { id: 'ruqya', label: 'الرقية الشرعية', emoji: '📖' },
  { id: 'prayer', label: 'الصلاة بحسب الاستطاعة', emoji: '🕌' },
]
export const adabSortItems = (): SortItem[] =>
  makeSortItems(ADAB_BUCKETS, [
    ['ذهبتُ إلى الطبيب لأعرف سبب الألم', 'treat', 'طلب المساعدة الطبية هو التداوي.'],
    ['اشتريتُ الدواء الذي وصفه الطبيب', 'treat', 'أخذ الدواء بوصفة الطبيب من التداوي.'],
    ['لم أتضجّر واحتسبتُ الأجر عند الله', 'patience', 'الصبر على المرض مع رجاء الثواب هو الاحتساب.'],
    ['قلتُ: ما أصابني بقدر الله وأرجو ثوابه', 'patience', 'الرضا ورجاء الثواب من الصبر والاحتساب.'],
    ['وضعتُ يدي على موضع الألم وقرأتُ الدعاء الوارد', 'ruqya', 'الرقية الشرعية بتكون بوضع اليد على موضع الألم والدعاء.'],
    ['صلّيتُ جالسةً لأنني لا أقدر على الوقوف', 'prayer', 'المريض بيصلي على الحالة اللي بيستطيعها.'],
  ])