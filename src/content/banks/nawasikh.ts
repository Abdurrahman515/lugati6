import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import type { ParseData, ParseRole } from '../../widgets/ParseWidget'
import { choiceQ, makeSortItems } from '../helpers'
import { pick, shuffled } from '../../lib/random'
import { CASE_LABEL, FORM_LABEL, SIGNS, SIGN_LABEL, SIGN_TABLE } from './irab'
import type { Case, NounForm, Sign } from './irab'

export type NasikhKind = 'verb' | 'harf'
export type Meaning = 'past' | 'change' | 'neg' | 'emphasis' | 'simile' | 'wish' | 'hope'
type Part = 'ism' | 'khabar'

export interface NasikhItem {
  id: string
  kind: NasikhKind
  n: string
  meaning: Meaning
  ism: string
  ismForm: NounForm
  khabar: string
  khabarForm: NounForm
}

const mk =
  (kind: NasikhKind) =>
  (id: string, n: string, meaning: Meaning, ism: string, ismForm: NounForm, khabar: string, khabarForm: NounForm): NasikhItem => ({
    id,
    kind,
    n,
    meaning,
    ism,
    ismForm,
    khabar,
    khabarForm,
  })
const V = mk('verb')
const H = mk('harf')

export const KANA_BANK: NasikhItem[] = [
  V('k1', 'كَانَ', 'past', 'الجَوُّ', 'single', 'بَارِدًا', 'single'),
  V('k2', 'كَانَتِ', 'past', 'السَّمَاءُ', 'single', 'صَافِيَةً', 'single'),
  V('k3', 'كَانَ', 'past', 'الطُّلَّابُ', 'broken', 'مُجْتَهِدِينَ', 'mascSound'),
  V('k4', 'كَانَتِ', 'past', 'الطَّالِبَاتُ', 'femSound', 'مُتَفَوِّقَاتٍ', 'femSound'),
  V('k5', 'كَانَ', 'past', 'الوَلَدَانِ', 'dual', 'مُهَذَّبَيْنِ', 'dual'),
  V('k6', 'كَانَ', 'past', 'أَبُوكَ', 'five', 'كَرِيمًا', 'single'),
  V('k7', 'صَارَ', 'change', 'الطِّفْلُ', 'single', 'طَوِيلًا', 'single'),
  V('k8', 'صَارَتِ', 'change', 'الغُيُومُ', 'broken', 'كَثِيفَةً', 'single'),
  V('k9', 'صَارَ', 'change', 'المُجْتَهِدُونَ', 'mascSound', 'قَادَةً', 'broken'),
  V('k10', 'صَارَ', 'change', 'الطَّالِبَانِ', 'dual', 'صَدِيقَيْنِ', 'dual'),
  V('k11', 'صَارَ', 'change', 'أَخُوكَ', 'five', 'مُهَنْدِسًا', 'single'),
  V('k12', 'لَيْسَ', 'neg', 'الكَسَلُ', 'single', 'مُفِيدًا', 'single'),
  V('k13', 'لَيْسَتِ', 'neg', 'الأَشْجَارُ', 'broken', 'عَالِيَةً', 'single'),
  V('k14', 'لَيْسَ', 'neg', 'المُعَلِّمَانِ', 'dual', 'غَائِبَيْنِ', 'dual'),
  V('k15', 'لَيْسَ', 'neg', 'المُؤْمِنُونَ', 'mascSound', 'يَائِسِينَ', 'mascSound'),
  V('k16', 'لَيْسَتِ', 'neg', 'المُعَلِّمَاتُ', 'femSound', 'غَائِبَاتٍ', 'femSound'),
]

export const INNA_BANK: NasikhItem[] = [
  H('h1', 'إِنَّ', 'emphasis', 'العِلْمَ', 'single', 'نُورٌ', 'single'),
  H('h2', 'إِنَّ', 'emphasis', 'الطُّلَّابَ', 'broken', 'مُجْتَهِدُونَ', 'mascSound'),
  H('h3', 'إِنَّ', 'emphasis', 'المُعَلِّمَيْنِ', 'dual', 'مُخْلِصَانِ', 'dual'),
  H('h4', 'إِنَّ', 'emphasis', 'المُسْلِمِينَ', 'mascSound', 'مُتَعَاوِنُونَ', 'mascSound'),
  H('h5', 'إِنَّ', 'emphasis', 'الطَّالِبَاتِ', 'femSound', 'مُجْتَهِدَاتٌ', 'femSound'),
  H('h6', 'إِنَّ', 'emphasis', 'أَبَاكَ', 'five', 'كَرِيمٌ', 'single'),
  H('h7', 'كَأَنَّ', 'simile', 'القَمَرَ', 'single', 'مِصْبَاحٌ', 'single'),
  H('h8', 'كَأَنَّ', 'simile', 'النُّجُومَ', 'broken', 'قَنَادِيلُ', 'broken'),
  H('h9', 'كَأَنَّ', 'simile', 'الغَيْمَتَيْنِ', 'dual', 'جَبَلَانِ', 'dual'),
  H('h10', 'لَيْتَ', 'wish', 'الإِجَازَةَ', 'single', 'طَوِيلَةٌ', 'single'),
  H('h11', 'لَيْتَ', 'wish', 'الطُّلَّابَ', 'broken', 'نَاجِحُونَ', 'mascSound'),
  H('h12', 'لَيْتَ', 'wish', 'أَخَاكَ', 'five', 'حَاضِرٌ', 'single'),
  H('h13', 'لَعَلَّ', 'hope', 'المَطَرَ', 'single', 'غَزِيرٌ', 'single'),
  H('h14', 'لَعَلَّ', 'hope', 'المُعَلِّمَاتِ', 'femSound', 'حَاضِرَاتٌ', 'femSound'),
  H('h15', 'لَعَلَّ', 'hope', 'الوَلَدَيْنِ', 'dual', 'نَاجِحَانِ', 'dual'),
  H('h16', 'لَعَلَّ', 'hope', 'المُجْتَهِدِينَ', 'mascSound', 'فَائِزُونَ', 'mascSound'),
]

export const NASIKH_BANK: NasikhItem[] = [...KANA_BANK, ...INNA_BANK]

export function byNasikh(id: string): NasikhItem {
  const found = NASIKH_BANK.find((b) => b.id === id)
  if (!found) throw new Error(`الجملة غير موجودة في البنك: ${id}`)
  return found
}

const MEAN_LABEL: Record<Meaning, string> = {
  past: 'الاتصاف في الزمن الماضي',
  change: 'التحوّل',
  neg: 'النفي',
  emphasis: 'التوكيد',
  simile: 'التشبيه',
  wish: 'التمنّي',
  hope: 'الترجّي',
}

const MEAN_RULE: Record<Meaning, string> = {
  past: 'كان بتفيد اتصاف المبتدأ بالخبر بالزمن الماضي.',
  change: 'صار بتفيد التحوّل من حال لحال.',
  neg: 'ليس بتفيد النفي.',
  emphasis: 'إنّ بتفيد التوكيد.',
  simile: 'كأنّ بتفيد التشبيه.',
  wish: 'ليت بتفيد التمنّي.',
  hope: 'لعلّ بتفيد الترجّي.',
}

export const KANA_BUCKETS = [
  { id: 'past', label: 'الاتصاف في الماضي (كان)', emoji: '⏳' },
  { id: 'change', label: 'التحوّل (صار)', emoji: '🦋' },
  { id: 'neg', label: 'النفي (ليس)', emoji: '🚫' },
]

export const INNA_BUCKETS = [
  { id: 'emphasis', label: 'التوكيد (إنّ)', emoji: '💪' },
  { id: 'simile', label: 'التشبيه (كأنّ)', emoji: '🪞' },
  { id: 'wish', label: 'التمنّي (ليت)', emoji: '🌠' },
  { id: 'hope', label: 'الترجّي (لعلّ)', emoji: '🤞' },
]

const BASE: Record<string, string> = {
  كَانَ: 'كَانَ',
  كَانَتِ: 'كَانَ',
  صَارَ: 'صَارَ',
  صَارَتِ: 'صَارَ',
  لَيْسَ: 'لَيْسَ',
  لَيْسَتِ: 'لَيْسَ',
}
const baseOf = (it: NasikhItem): string => BASE[it.n] ?? it.n

const CASE_WORD: Record<Case, string> = { raf: 'مرفوع', nasb: 'منصوب', jarr: 'مجرور' }
const FORMS = Object.keys(SIGN_TABLE) as NounForm[]

const caseOfPart = (it: NasikhItem, part: Part): Case =>
  it.kind === 'verb' ? (part === 'ism' ? 'raf' : 'nasb') : part === 'ism' ? 'nasb' : 'raf'
const formOf = (it: NasikhItem, part: Part): NounForm => (part === 'ism' ? it.ismForm : it.khabarForm)
const wordOf = (it: NasikhItem, part: Part): string => (part === 'ism' ? it.ism : it.khabar)
const signOfPart = (it: NasikhItem, part: Part): Sign => SIGN_TABLE[formOf(it, part)][caseOfPart(it, part)]

/** تُعرض الكلمة بلا حركتها الأخيرة حتى لا تكشف الجواب */
const stripEnd = (w: string): string => w.replace(/[\u064B-\u0652]+$/, '')

export const sentenceOf = (it: NasikhItem): string => `${it.n} ${it.ism} ${it.khabar}`

const marked = (it: NasikhItem, part: Part): string =>
  part === 'ism' ? `${it.n} **${stripEnd(it.ism)}** ${it.khabar}` : `${it.n} ${it.ism} **${stripEnd(it.khabar)}**`

const partName = (it: NasikhItem, part: Part): string => `${part === 'ism' ? 'اسم' : 'خبر'} «${baseOf(it)}»`

/** أي أنواع الأسماء تستعمل هذه العلامة في هذه الحالة؟ */
function usersOf(c: Case, s: Sign): string {
  const f = FORMS.filter((x) => SIGN_TABLE[x][c] === s).map((x) => FORM_LABEL[x])
  return f.length
    ? `${SIGN_LABEL[s]} بتكون علامة ${CASE_LABEL[c]} لـ: ${f.join('، ')}`
    : `${SIGN_LABEL[s]} ما بتكون علامة ${CASE_LABEL[c]} لأي نوع من الأسماء`
}

function signQuestion(it: NasikhItem, part: Part): Question {
  const c = caseOfPart(it, part)
  const correct = signOfPart(it, part)
  const w = stripEnd(wordOf(it, part))
  const f = FORM_LABEL[formOf(it, part)]
  const others = shuffled(SIGNS.filter((s) => s !== correct)).slice(0, 3)
  return choiceQ(
    `nasikh-sign-${it.id}-${part}`,
    `ما **علامة ${CASE_LABEL[c]}** في الكلمة الغامقة؟ (${partName(it, part)})\n${marked(it, part)}`,
    [SIGN_LABEL[correct], `أحسنتِ! «${w}» (${f}) هي ${partName(it, part)}، وحالتها ${CASE_LABEL[c]}، فعلامتها ${SIGN_LABEL[correct]}.`],
    others.map((s): [string, string] => [
      SIGN_LABEL[s],
      `${usersOf(c, s)}. أما «${w}» (${f}) فعلامة ${CASE_LABEL[c]} إلها ${SIGN_LABEL[correct]}.`,
    ]),
  )
}

function caseQuestion(it: NasikhItem, part: Part): Question {
  const c = caseOfPart(it, part)
  const w = stripEnd(wordOf(it, part))
  const rule =
    it.kind === 'verb' ? 'الفعل الناسخ بيرفع الاسم وبينصب الخبر' : 'الحرف الناسخ بينصب الاسم وبيرفع الخبر'
  const cases: Case[] = ['raf', 'nasb', 'jarr']
  return choiceQ(
    `nasikh-case-${it.id}-${part}`,
    `ما **حالة** الكلمة الغامقة بعد دخول الناسخ؟ (${partName(it, part)})\n${marked(it, part)}`,
    [CASE_LABEL[c], `أحسنتِ! ${rule}، و«${w}» هي ${partName(it, part)}، فحالتها ${CASE_LABEL[c]} (${CASE_WORD[c]}).`],
    cases
      .filter((x) => x !== c)
      .map((x): [string, string] => [
        CASE_LABEL[x],
        `${rule}. و«${w}» هي ${partName(it, part)}، فحالتها ${CASE_LABEL[c]} مش ${CASE_LABEL[x]}.`,
      ]),
  )
}

function partQuestion(it: NasikhItem, part: Part): Question {
  const w = wordOf(it, part)
  const other = wordOf(it, part === 'ism' ? 'khabar' : 'ism')
  const def =
    part === 'ism'
      ? 'اسم الناسخ هو المبتدأ الأصلي قبل ما يدخل عليه الناسخ'
      : 'خبر الناسخ هو الجزء اللي بيتمّم المعنى'
  const otherRole = part === 'ism' ? 'خبر' : 'اسم'
  const thisRole = part === 'ism' ? 'اسم' : 'خبر'
  return choiceQ(
    `nasikh-part-${it.id}-${part}`,
    `ما **${thisRole}** «${baseOf(it)}» في هذه الجملة؟\n${sentenceOf(it)}`,
    [w, `أحسنتِ! ${def}، وهو «${w}» هون.`],
    [
      [other, `«${other}» هي ${otherRole} «${baseOf(it)}» مش ${thisRole}ه. ${def}.`],
      [it.n, `«${it.n}» هو الناسخ نفسه مش ${thisRole}ه. ${def}.`],
    ],
  )
}

function meaningQuestion(it: NasikhItem): Question {
  const group: Meaning[] = it.kind === 'verb' ? ['past', 'change', 'neg'] : ['emphasis', 'simile', 'wish', 'hope']
  return choiceQ(
    `nasikh-meaning-${it.id}`,
    `ما المعنى الذي أضافه الناسخ «${it.n}» للجملة؟\n${sentenceOf(it)}`,
    [MEAN_LABEL[it.meaning], `أحسنتِ! ${MEAN_RULE[it.meaning]}`],
    group
      .filter((x) => x !== it.meaning)
      .map((x): [string, string] => [
        MEAN_LABEL[x],
        `${MEAN_RULE[x]} أما هون فالناسخ «${it.n}» فبيفيد ${MEAN_LABEL[it.meaning]}.`,
      ]),
  )
}

function kindQuestion(it: NasikhItem): Question {
  const isVerb = it.kind === 'verb'
  return choiceQ(
    `nasikh-kind-${it.id}`,
    `ما نوع الناسخ «${it.n}» في هذه الجملة؟\n${sentenceOf(it)}`,
    isVerb
      ? ['فعل ناسخ', 'أحسنتِ! كان وصار وليس أفعال ناسخة: بترفع الاسم وبتنصب الخبر.']
      : ['حرف ناسخ', 'أحسنتِ! إنّ وكأنّ وليت ولعلّ حروف ناسخة: بتنصب الاسم وبترفع الخبر.'],
    [
      isVerb
        ? ['حرف ناسخ', `«${it.n}» فعل مش حرف: كان وصار وليس أفعال ناسخة، وإنّ وأخواتها هي الحروف.`]
        : ['فعل ناسخ', `«${it.n}» حرف مش فعل: إنّ وكأنّ وليت ولعلّ حروف ناسخة، وكان وأخواتها هي الأفعال.`],
    ],
  )
}

function anyQuestion(it: NasikhItem, withKind: boolean): Question {
  const mode = pick(withKind ? ['part', 'case', 'sign', 'meaning', 'kind'] : ['part', 'case', 'sign', 'meaning'])
  const part: Part = pick(['ism', 'khabar'] as const)
  if (mode === 'part') return partQuestion(it, part)
  if (mode === 'case') return caseQuestion(it, part)
  if (mode === 'sign') return signQuestion(it, part)
  if (mode === 'meaning') return meaningQuestion(it)
  return kindQuestion(it)
}

export function makeKanaQuestion(): Question {
  return anyQuestion(pick(KANA_BANK), false)
}
export function makeInnaQuestion(): Question {
  return anyQuestion(pick(INNA_BANK), false)
}
export function makeNawasikhMixQuestion(): Question {
  return anyQuestion(pick(NASIKH_BANK), true)
}

export function nasikhSignQuestion(id: string, part: Part): Question {
  return signQuestion(byNasikh(id), part)
}
export function nasikhPartQuestion(id: string, part: Part): Question {
  return partQuestion(byNasikh(id), part)
}

export function nasikhSortItems(ids: string[], buckets: { id: string; label: string }[]): SortItem[] {
  return makeSortItems(
    buckets,
    ids.map((id): [string, string, string] => {
      const it = byNasikh(id)
      return [sentenceOf(it), it.meaning, `الناسخ «${it.n}» بيفيد ${MEAN_LABEL[it.meaning]}.`]
    }),
  )
}

export const parseRoles = (harf: boolean): ParseRole[] => [
  { id: 'nasikh', label: harf ? 'الحرف الناسخ' : 'الفعل الناسخ', emoji: '🟨' },
  { id: 'ism', label: 'اسمه', emoji: '🟩' },
  { id: 'khabar', label: 'خبره', emoji: '🟥' },
]

export function nawasikhParse(id: string, prompt = 'لوّني كل كلمة بدورها 🎨'): ParseData {
  const it = byNasikh(id)
  const harf = it.kind === 'harf'
  const after = harf ? 'منصوباً' : 'مرفوعاً'
  const afterKhabar = harf ? 'مرفوعاً' : 'منصوباً'
  return {
    prompt,
    roles: parseRoles(harf),
    words: [
      {
        text: it.n,
        role: 'nasikh',
        why: `«${it.n}» ${harf ? 'حرف' : 'فعل'} ناسخ: دخل على الجملة الاسمية وغيّر إعرابها.`,
        hint: 'الناسخ هو الكلمة الجديدة اللي دخلت على الجملة الاسمية (المبتدأ والخبر).',
      },
      {
        text: it.ism,
        role: 'ism',
        why: `«${stripEnd(it.ism)}» هو اسم «${baseOf(it)}»: المبتدأ الأصلي، وصار ${after}.`,
        hint: 'اسم الناسخ هو المبتدأ الأصلي قبل ما يدخل الناسخ.',
      },
      {
        text: it.khabar,
        role: 'khabar',
        why: `«${stripEnd(it.khabar)}» هو خبر «${baseOf(it)}»: الجزء المتمّم للمعنى، وصار ${afterKhabar}.`,
        hint: 'خبر الناسخ هو الجزء اللي بيتمّم المعنى وبيجي بعد اسمه.',
      },
    ],
  }
}