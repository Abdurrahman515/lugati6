import type { ChoiceQuestion } from '../../../types'
import type { SortBucket, SortData } from '../../../widgets/SortWidget'
import { choiceQ, makeSortItems } from '../../helpers'
import { pick, randomInt } from '../../../lib/random'

export type NounKind = 'maqsur' | 'manqus' | 'mamdud'
export type CaseId = 'raf' | 'nasb' | 'jarr'

const CASES: CaseId[] = ['raf', 'nasb', 'jarr']
const CASE_LABEL: Record<CaseId, string> = { raf: 'الرفع', nasb: 'النصب', jarr: 'الجر' }
const STATE: Record<CaseId, string> = { raf: 'مرفوع', nasb: 'منصوب', jarr: 'مجرور' }
const MARK_NAME: Record<CaseId, string> = { raf: 'ضمتان', nasb: 'فتحتان', jarr: 'كسرتان' }

const FATHATAN = '\u064B'
const DAMMATAN = '\u064C'
const KASRATAN = '\u064D'
const MAQ_END = /\u064E([\u0649\u0627])$/
const MAN_END = /\u0650\u064A$/
const MAM_END = /\u0621$/

interface Noun {
  base: string
  kind: NounKind
}

const n = (kind: NounKind, bases: string[]): Noun[] => bases.map((base) => ({ base, kind }))

/** أسماء نكرة صالحة للتنوين (استُبعدت الممنوعة من الصرف مثل «صحراء» و«ليلى») */
const NOUNS: Noun[] = [
  ...n('maqsur', ['هُدَى', 'عَصَا', 'فَتَى', 'مَعْنَى', 'مُسْتَشْفَى', 'رَحَى', 'قَفَا', 'نَدَى', 'حَصَى', 'ثَرَى', 'تُقَى', 'مُنَى']),
  ...n('manqus', ['قَاضِي', 'رَاعِي', 'دَاعِي', 'سَاعِي', 'مُنَادِي', 'وَاشِي', 'عَالِي', 'بَاقِي', 'غَالِي', 'مُمَارِي']),
  ...n('mamdud', ['دُعَاء', 'سَمَاء', 'مَاء', 'غِذَاء', 'شِفَاء', 'بِنَاء', 'هَوَاء', 'وَفَاء', 'ابْتِدَاء', 'غِطَاء', 'رِدَاء', 'اسْتِقْرَاء']),
]

/** يولّد شكل الاسم منوّناً بحسب نوعه وحالته */
export function tanweenForm(base: string, kind: NounKind, c: CaseId): string {
  if (kind === 'maqsur') return base.replace(MAQ_END, `${FATHATAN}$1`)
  if (kind === 'manqus') return c === 'nasb' ? `${base}${FATHATAN}ا` : base.replace(MAN_END, KASRATAN)
  return base + (c === 'raf' ? DAMMATAN : c === 'nasb' ? FATHATAN : KASRATAN)
}

function wrongForms(base: string, kind: NounKind, c: CaseId): [string, string][] {
  if (kind === 'maqsur') {
    const last = base.slice(-1)
    const swapped = base.replace(MAQ_END, `${FATHATAN}${last === 'ى' ? 'ا' : 'ى'}`)
    const out: [string, string][] = [
      [base.replace(MAQ_END, KASRATAN), 'عاملتِيه متل المنقوص وحذفتِ آخره، بس المقصور بيحافظ على ألفه.'],
      [swapped, 'صورة الألف بتضل متل ما هي بالتنوين، ما بتتغيّر.'],
    ]
    const fixed = 'المقصور ما بتظهر عليه ضمة ولا كسرة؛ تنوينه واحد دايماً: فتحتان قبل الألف.'
    if (c === 'raf') out.push([base + DAMMATAN, fixed])
    if (c === 'jarr') out.push([base + KASRATAN, fixed])
    return out
  }
  if (kind === 'manqus') {
    const noYa = (s: string) => base.replace(MAN_END, s)
    if (c === 'raf')
      return [
        [base + DAMMATAN, 'ياء المنقوص بتنحذف بالرفع والجر، فما بنكتبها.'],
        [noYa(DAMMATAN), 'حذفتِ الياء صح، بس تنوين المنقوص بالرفع كسرتان مش ضمتين.'],
        [tanweenForm(base, kind, 'nasb'), 'الياء مع الفتحتين بتجي بالنصب بس، وهون الاسم مرفوع.'],
      ]
    if (c === 'jarr')
      return [
        [base + KASRATAN, 'ياء المنقوص بتنحذف بالرفع والجر، فما بنكتبها.'],
        [noYa(DAMMATAN), 'حذفتِ الياء صح، بس تنوين المنقوص بالجر كسرتان مش ضمتين.'],
        [tanweenForm(base, kind, 'nasb'), 'الياء مع الفتحتين بتجي بالنصب بس، وهون الاسم مجرور.'],
      ]
    return [
      [noYa(KASRATAN), 'حذف الياء بيصير بالرفع والجر، وهون الاسم منصوب فالياء بتثبت.'],
      [noYa(`${FATHATAN}ا`), 'حذفتِ الياء، والمنقوص المنصوب بتثبت ياؤه ومعها فتحتان.'],
      [base + DAMMATAN, 'الضمتان بتجي بالرفع، وهون الاسم منصوب.'],
    ]
  }
  const other = (x: CaseId) => `${CASE_LABEL[x]}: ${MARK_NAME[x]} بتجي بحالة ${CASE_LABEL[x]}، وهون الاسم ${STATE[c]}.`
  const wrongCases = CASES.filter((x) => x !== c).map((x): [string, string] => [tanweenForm(base, kind, x), other(x)])
  if (c === 'raf') return [...wrongCases, [base.replace(MAM_END, '\u0624') + DAMMATAN, 'الهمزة جاءت بعد ألف ساكنة، فبتنكتب على السطر مش على واو.']]
  if (c === 'jarr') return [...wrongCases, [base.replace(MAM_END, '\u0626') + KASRATAN, 'الهمزة جاءت بعد ألف ساكنة، فبتنكتب على السطر مش على نبرة.']]
  return [...wrongCases, [`${base}${FATHATAN}ا`, 'زدتِ ألف بعد الهمزة، والممدود بيكفيه الفتحتان فوق الهمزة من غير ألف.']]
}

function rightWhy(kind: NounKind, c: CaseId): string {
  if (kind === 'maqsur') return 'اسم مقصور: تنوينه واحد بكل الحالات، فتحتان قبل الألف.'
  if (kind === 'manqus')
    return c === 'nasb' ? 'اسم منقوص منصوب: بتثبت ياؤه ومعها فتحتان.' : `اسم منقوص ${STATE[c]}: بتنحذف ياؤه وبنكتب كسرتين.`
  return `اسم ممدود ${STATE[c]}: الهمزة على السطر وفوقها ${MARK_NAME[c]}${c === 'nasb' ? ' من غير ألف زيادة' : ''}.`
}

/** من الحالة إلى الشكل: أيّ كتابة صحيحة لتنوين الاسم في هذه الحالة؟ */
export function makeTanweenFormQuestion(): ChoiceQuestion {
  const i = randomInt(NOUNS.length)
  const { base, kind } = NOUNS[i]
  const c = pick(CASES)
  return choiceQ(
    `s2-tform-${i}-${c}`,
    `نوّني الاسم «**${base}**» في حالة **${CASE_LABEL[c]}**. أيّ كتابة صحيحة؟`,
    [tanweenForm(base, kind, c), `صح! ${rightWhy(kind, c)}`],
    wrongForms(base, kind, c),
  )
}

/** من الشكل إلى الحالة (للممدود، وللمنقوص المنصوب لأن شكله لا يحتمل غير النصب) */
export function makeTanweenCaseQuestion(): ChoiceQuestion {
  const cand = NOUNS.map((x, i) => ({ ...x, i })).filter((x) => x.kind !== 'maqsur')
  const w = pick(cand)
  const c: CaseId = w.kind === 'manqus' ? 'nasb' : pick(CASES)
  const form = tanweenForm(w.base, w.kind, c)
  const right = w.kind === 'manqus' ? 'الياء الثابتة مع فتحتين علامة النصب في المنقوص.' : `${MARK_NAME[c]} فوق الهمزة علامة ${CASE_LABEL[c]}.`
  const wrongs = CASES.filter((x) => x !== c).map((x): [string, string] => [
    CASE_LABEL[x],
    w.kind === 'manqus'
      ? `بحالة ${CASE_LABEL[x]} بتنحذف ياء المنقوص، وهون الياء ثابتة مع فتحتين.`
      : `${MARK_NAME[x]} هي علامة ${CASE_LABEL[x]}، وهون التنوين ${MARK_NAME[c]}.`,
  ])
  return choiceQ(`s2-tcase-${w.i}-${c}`, `في أيّ حالة إعرابية جاءت الكلمة المنوّنة «**${form}**»؟`, [CASE_LABEL[c], `صح! ${right}`], wrongs)
}

const MUDAF = ['المُعَلِّمِ', 'المَدِينَةِ', 'الطِّفْلِ']

/** هل يلحق الكلمة تنوين؟ (نكرة، أو معرّفة بـ«ال»، أو مضافة) */
export function makeNoTanweenQuestion(): ChoiceQuestion {
  const i = randomInt(NOUNS.length)
  const { base } = NOUNS[i]
  const mode = pick(['nakira', 'al', 'idafa'] as const)
  const YES = 'نعم، لأنها اسم نكرة غير مضافة'
  const NO_AL = 'لا، لأنها معرّفة بـ«ال»'
  const NO_ID = 'لا، لأنها مضافة'
  const NO_VERB = 'لا، لأنها فعل'
  const verbWhy = 'هي اسم مش فعل، والتنوين من خصائص الأسماء.'
  if (mode === 'nakira')
    return choiceQ(`s2-tno-${i}-n`, `هل يلحق الكلمة «**${base}**» تنوين؟`, [YES, 'صح! اسم نكرة غير مضافة وما اقترنت بـ«ال»، فبيلحقه تنوين.'], [
      [NO_AL, 'ما فيها «ال»، فهي نكرة.'],
      [NO_ID, 'ما إلها مضاف إليه بعدها، فهي مش مضافة.'],
      [NO_VERB, verbWhy],
    ])
  if (mode === 'al')
    return choiceQ(`s2-tno-${i}-a`, `هل يلحق الكلمة «**ال${base}**» تنوين؟`, [NO_AL, 'صح! اقترنت بـ«ال»، وما بيلحق التنوين الاسم المعرّف بـ«ال».'], [
      [YES, 'فيها «ال»، فما بيلحقها تنوين.'],
      [NO_ID, 'الكلمة هون معرّفة بـ«ال» مش مضافة.'],
      [NO_VERB, verbWhy],
    ])
  const m = pick(MUDAF)
  return choiceQ(`s2-tno-${i}-i`, `هل يلحق الكلمة «**${base}**» تنوين في «${base} ${m}»؟`, [NO_ID, 'صح! جاء بعدها مضاف إليه، والمضاف ما بيلحقه تنوين.'], [
    [YES, 'هي مضافة هون، فما بيلحقها تنوين.'],
    [NO_AL, 'ما فيها «ال»؛ سبب عدم التنوين هو الإضافة.'],
    [NO_VERB, verbWhy],
  ])
}

const KIND_BUCKETS: SortBucket[] = [
  { id: 'maqsur', label: 'مقصور', emoji: '🌙' },
  { id: 'manqus', label: 'منقوص', emoji: '🌿' },
  { id: 'mamdud', label: 'ممدود', emoji: '☁️' },
]

const KIND_WHY: Record<NounKind, string> = {
  maqsur: 'آخره ألف لازمة، فهو اسم مقصور.',
  manqus: 'آخره ياء لازمة قبلها كسرة، فهو اسم منقوص.',
  mamdud: 'آخره همزة بعد ألف، فهو اسم ممدود.',
}

const kindRow = (kind: NounKind, words: string[]): [string, string, string][] =>
  words.map((w) => [w, kind, `${KIND_WHY[kind]}${w.startsWith('ال') ? ' و«ال» ما بتغيّر نوعه.' : ''}`])

/** تصنيف النوع، وفيه كلمات بـ«ال» لتأكيد أن التعريف لا يغيّر نوع الاسم */
export const tanweenKindSort: SortData = {
  prompt: 'صنّفي الكلمة: مقصور ولا منقوص ولا ممدود؟ 🔎',
  buckets: KIND_BUCKETS,
  items: makeSortItems(KIND_BUCKETS, [
    ...kindRow('maqsur', ['عَصَا', 'العُلَا', 'مُسْتَشْفَى', 'الفَتَى']),
    ...kindRow('manqus', ['القَاضِي', 'الدَّاعِي', 'المُنَادِي', 'الرَّاضِي']),
    ...kindRow('mamdud', ['وَفَاء', 'شِفَاء', 'غِذَاء', 'ابْتِدَاء']),
  ]),
}

const CASE_BUCKETS: SortBucket[] = [
  { id: 'raf', label: 'الرفع', emoji: '⬆️' },
  { id: 'nasb', label: 'النصب', emoji: '➡️' },
  { id: 'jarr', label: 'الجر', emoji: '⬇️' },
]

/** الحالة الإعرابية للكلمة المنوّنة داخل جملة (فيها مقصور ليظهر أن شكله لا يدل على الحالة) */
export const tanweenCaseSort: SortData = {
  prompt: 'ما حالة الكلمة المنوّنة بين « »؟ فكّري بدورها في الجملة 🧐',
  buckets: CASE_BUCKETS,
  items: makeSortItems(CASE_BUCKETS, [
    ['هَذَا «غِذَاءٌ» مُفِيدٌ.', 'raf', '«غذاء» خبر لـ«هذا»، فهو مرفوع.'],
    ['جَاءَ «قَاضٍ» إِلَى المَجْلِسِ.', 'raf', '«قاضٍ» فاعل، والفاعل مرفوع.'],
    ['ارْتَفَعَ «مَاءٌ» فِي الوَادِي.', 'raf', '«ماء» فاعل، والفاعل مرفوع.'],
    ['مَرَّ بِنَا «فَتًى» نَشِيطٌ.', 'raf', '«فتى» فاعل مرفوع، بس شكل تنوينه ما بيدل على الرفع.'],
    ['سَمِعْتُ «مُنَادِيًا» يَدْعُو لِلْخَيْرِ.', 'nasb', '«مناديًا» مفعول به منصوب، والياء ثابتة مع فتحتين.'],
    ['رَأَيْتُ «سَمَاءً» صَافِيَةً.', 'nasb', '«سماءً» مفعول به منصوب.'],
    ['اسْتَقْبَلْتُ «قَاضِيًا» عَادِلًا.', 'nasb', '«قاضيًا» مفعول به منصوب.'],
    ['رَأَيْتُ «فَتًى» نَشِيطًا.', 'nasb', '«فتى» مفعول به منصوب، وشكل تنوينه نفسه بكل الحالات.'],
    ['نَظَرْتُ إِلَى «سَمَاءٍ» صَافِيَةٍ.', 'jarr', 'اسم مجرور بحرف الجر «إلى».'],
    ['مَرَرْتُ بِـ«رَاعٍ» فِي الطَّرِيقِ.', 'jarr', 'اسم مجرور بحرف الجر الباء.'],
    ['يَحْتَاجُ الجِسْمُ إِلَى «غِذَاءٍ» مُتَوَازِنٍ.', 'jarr', 'اسم مجرور بحرف الجر «إلى».'],
    ['سَلَّمْتُ عَلَى «فَتًى» نَشِيطٍ.', 'jarr', '«فتى» مجرور بـ«على»، وشكل تنوينه ما تغيّر.'],
  ]),
}