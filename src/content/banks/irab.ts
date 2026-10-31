import type { Question } from '../../types'
import type { SortItem } from '../../widgets/SortWidget'
import { pick, shuffled } from '../../lib/random'

export type NounForm = 'single' | 'broken' | 'femSound' | 'mascSound' | 'dual' | 'five'
export type Role = 'فاعل' | 'مفعول به' | 'مبتدأ' | 'خبر' | 'اسم مجرور'
export type Case = 'raf' | 'nasb' | 'jarr'
export type Sign = 'damma' | 'fatha' | 'kasra' | 'waw' | 'alif' | 'ya'

export const SIGNS: Sign[] = ['damma', 'fatha', 'kasra', 'waw', 'alif', 'ya']
export const SIGN_LABEL: Record<Sign, string> = {
  damma: 'الضمة',
  fatha: 'الفتحة',
  kasra: 'الكسرة',
  waw: 'الواو',
  alif: 'الألف',
  ya: 'الياء',
}
export const CASES: Case[] = ['raf', 'nasb', 'jarr']
export const CASE_LABEL: Record<Case, string> = { raf: 'الرفع', nasb: 'النصب', jarr: 'الجر' }
const ROLES: Role[] = ['فاعل', 'مفعول به', 'مبتدأ', 'خبر', 'اسم مجرور']

const FORM_LABEL: Record<NounForm, string> = {
  single: 'اسم مفرد',
  broken: 'جمع تكسير',
  femSound: 'جمع مؤنث سالم',
  mascSound: 'جمع مذكر سالم',
  dual: 'مثنى',
  five: 'من الأسماء الخمسة',
}

const SIGN_TABLE: Record<NounForm, Record<Case, Sign>> = {
  single: { raf: 'damma', nasb: 'fatha', jarr: 'kasra' },
  broken: { raf: 'damma', nasb: 'fatha', jarr: 'kasra' },
  femSound: { raf: 'damma', nasb: 'kasra', jarr: 'kasra' },
  mascSound: { raf: 'waw', nasb: 'ya', jarr: 'ya' },
  dual: { raf: 'alif', nasb: 'ya', jarr: 'ya' },
  five: { raf: 'waw', nasb: 'alif', jarr: 'ya' },
}

const CASE_OF_ROLE: Record<Role, Case> = {
  فاعل: 'raf',
  مبتدأ: 'raf',
  خبر: 'raf',
  'مفعول به': 'nasb',
  'اسم مجرور': 'jarr',
}

const CASE_REASON: Record<Role, string> = {
  فاعل: 'الفاعل مرفوع دائماً',
  مبتدأ: 'المبتدأ مرفوع دائماً',
  خبر: 'الخبر مرفوع دائماً',
  'مفعول به': 'المفعول به منصوب',
  'اسم مجرور': 'الاسم الذي بعد حرف الجر مجرور',
}

const ROLE_HINT: Record<Role, string> = {
  فاعل: 'الفاعل هو من قام بالفعل',
  'مفعول به': 'المفعول به هو من وقع عليه الفعل',
  مبتدأ: 'المبتدأ هو الاسم الذي تبدأ به الجملة الاسمية',
  خبر: 'الخبر هو ما يُتمّم معنى المبتدأ',
  'اسم مجرور': 'الاسم المجرور هو الاسم الذي يأتي بعد حرف جر',
}

const SIGN_RULE: Record<Sign, string> = {
  damma: 'الضمة علامة الرفع الأصلية، وبتجي مع المفرد وجمع التكسير وجمع المؤنث السالم.',
  fatha: 'الفتحة علامة النصب، وبتجي مع المفرد وجمع التكسير.',
  kasra: 'الكسرة علامة الجر مع المفرد وجمع التكسير وجمع المؤنث السالم، وهي كمان علامة نصب جمع المؤنث السالم.',
  waw: 'الواو علامة رفع جمع المذكر السالم والأسماء الخمسة.',
  alif: 'الألف علامة رفع المثنى، وعلامة نصب الأسماء الخمسة.',
  ya: 'الياء علامة نصب وجر المثنى وجمع المذكر السالم، وعلامة جر الأسماء الخمسة.',
}

export interface IrabItem {
  id: string
  before: string
  w: string
  after: string
  form: NounForm
  role: Role
}

const it = (id: string, before: string, w: string, after: string, form: NounForm, role: Role): IrabItem => ({
  id,
  before,
  w,
  after,
  form,
  role,
})

export const IRAB_BANK: IrabItem[] = [
  it('i1', 'جَاءَ', 'المُسْلِمُونَ', '', 'mascSound', 'فاعل'),
  it('i2', 'رَأَيْتُ', 'المُسْلِمِينَ', '', 'mascSound', 'مفعول به'),
  it('i3', 'سَلَّمْتُ عَلَى', 'المُسْلِمِينَ', '', 'mascSound', 'اسم مجرور'),
  it('i4', 'حَضَرَ', 'المُعَلِّمَانِ', '', 'dual', 'فاعل'),
  it('i5', 'شَكَرْتُ', 'المُعَلِّمَيْنِ', '', 'dual', 'مفعول به'),
  it('i6', 'تَحَدَّثْتُ إِلَى', 'المُعَلِّمَيْنِ', '', 'dual', 'اسم مجرور'),
  it('i7', 'كَتَبَ', 'الطَّالِبُ', 'الدَّرْسَ', 'single', 'فاعل'),
  it('i8', 'كَتَبَ الطَّالِبُ', 'الدَّرْسَ', '', 'single', 'مفعول به'),
  it('i9', 'قَرَأَتِ', 'الطَّالِبَاتُ', '', 'femSound', 'فاعل'),
  it('i10', 'رَأَيْتُ', 'الطَّالِبَاتِ', '', 'femSound', 'مفعول به'),
  it('i11', 'سَلَّمْتُ عَلَى', 'الطَّالِبَاتِ', '', 'femSound', 'اسم مجرور'),
  it('i12', 'حَضَرَ', 'أَبُوكَ', '', 'five', 'فاعل'),
  it('i13', 'رَأَيْتُ', 'أَبَاكَ', '', 'five', 'مفعول به'),
  it('i14', 'ذَهَبْتُ إِلَى', 'أَبِيكَ', '', 'five', 'اسم مجرور'),
  it('i15', 'سَقَطَتِ', 'الأَوْرَاقُ', '', 'broken', 'فاعل'),
  it('i16', 'جَمَعْتُ', 'الأَوْرَاقَ', '', 'broken', 'مفعول به'),
  it('i17', 'نَظَرْتُ إِلَى', 'الأَشْجَارِ', '', 'broken', 'اسم مجرور'),
  it('i18', '', 'الطَّالِبَةُ', 'مُجْتَهِدَةٌ', 'single', 'مبتدأ'),
  it('i19', 'الطَّالِبَةُ', 'مُجْتَهِدَةٌ', '', 'single', 'خبر'),
  it('i20', '', 'المُعَلِّمُونَ', 'مُخْلِصُونَ', 'mascSound', 'مبتدأ'),
  it('i21', 'المُعَلِّمُونَ', 'مُخْلِصُونَ', '', 'mascSound', 'خبر'),
]

export const caseOf = (i: IrabItem): Case => CASE_OF_ROLE[i.role]
export const signOf = (i: IrabItem): Sign => SIGN_TABLE[i.form][caseOf(i)]

/** تُعرض الكلمة بلا حركتها الأخيرة حتى لا تكشف الجواب */
export const shownWord = (w: string): string => w.replace(/[\u064B-\u0652]+$/, '')

const sentence = (i: IrabItem): string =>
  [i.before, `**${shownWord(i.w)}**`, i.after].filter(Boolean).join(' ')

export function byIrabId(id: string): IrabItem {
  const found = IRAB_BANK.find((b) => b.id === id)
  if (!found) throw new Error(`الجملة غير موجودة في البنك: ${id}`)
  return found
}

function summary(i: IrabItem): string {
  return `«${shownWord(i.w)}» (${FORM_LABEL[i.form]}) موقعها: ${i.role}، فحالتها ${CASE_LABEL[caseOf(i)]} وعلامتها ${SIGN_LABEL[signOf(i)]}.`
}

function explainSign(i: IrabItem, picked: Sign): string {
  return `${SIGN_RULE[picked]} أما ${summary(i)}`
}

export function irabSortItems(ids: string[]): SortItem[] {
  return ids.map((id) => {
    const i = byIrabId(id)
    const whyNot: Record<string, string> = {}
    for (const s of SIGNS) {
      if (s !== signOf(i)) whyNot[s] = explainSign(i, s)
    }
    return {
      text: `${i.before} ${shownWord(i.w)}`.trim(),
      bucket: signOf(i),
      why: summary(i),
      whyNot,
    }
  })
}

function signQuestion(i: IrabItem): Question {
  const correct = signOf(i)
  const others = shuffled(SIGNS.filter((s) => s !== correct)).slice(0, 3)
  return {
    kind: 'choice',
    id: `irab-sign-${i.id}`,
    prompt: `ما **علامة إعراب** الكلمة الغامقة؟\n${sentence(i)}`,
    choices: [correct, ...others].map((s) =>
      s === correct
        ? { text: SIGN_LABEL[s], correct: true, why: `أحسنتِ! ${summary(i)}` }
        : { text: SIGN_LABEL[s], why: explainSign(i, s) },
    ),
  }
}

function caseQuestion(i: IrabItem): Question {
  const correct = caseOf(i)
  return {
    kind: 'choice',
    id: `irab-case-${i.id}`,
    prompt: `ما **الحالة الإعرابية** للكلمة الغامقة؟\n${sentence(i)}`,
    choices: CASES.map((c) =>
      c === correct
        ? {
            text: CASE_LABEL[c],
            correct: true,
            why: `أحسنتِ! «${shownWord(i.w)}» موقعها: ${i.role}، و${CASE_REASON[i.role]}، فحالتها ${CASE_LABEL[c]}.`,
          }
        : {
            text: CASE_LABEL[c],
            why: `«${shownWord(i.w)}» موقعها: ${i.role}، و${CASE_REASON[i.role]}، لذلك حالتها ${CASE_LABEL[correct]} وليست ${CASE_LABEL[c]}.`,
          },
    ),
  }
}

function roleQuestion(i: IrabItem): Question {
  const others = shuffled(ROLES.filter((r) => r !== i.role)).slice(0, 3)
  return {
    kind: 'choice',
    id: `irab-role-${i.id}`,
    prompt: `ما **الموقع الإعرابي** للكلمة الغامقة؟\n${sentence(i)}`,
    choices: [i.role, ...others].map((r) =>
      r === i.role
        ? { text: r, correct: true, why: `أحسنتِ! ${ROLE_HINT[r]}، وهذا ينطبق على «${shownWord(i.w)}» هنا.` }
        : {
            text: r,
            why: `${ROLE_HINT[r]}، وهذا ما بينطبق على «${shownWord(i.w)}». أما هنا فموقعها ${i.role}: ${ROLE_HINT[i.role]}.`,
          },
    ),
  }
}

export function makeIrabQuestion(): Question {
  const item = pick(IRAB_BANK)
  const mode = pick(['sign', 'case', 'role'] as const)
  return mode === 'sign' ? signQuestion(item) : mode === 'case' ? caseQuestion(item) : roleQuestion(item)
}