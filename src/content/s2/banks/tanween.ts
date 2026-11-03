import type { Block, ChoiceQuestion } from '../../../types'
import { choiceQ } from '../../helpers'
import { pickOne } from './util'

type TanweenKind = 'maqsur' | 'manqus' | 'mamdud'

const KIND_LABEL: Record<TanweenKind, string> = {
  maqsur: 'اسم مقصور',
  manqus: 'اسم منقوص',
  mamdud: 'اسم ممدود',
}

const KIND_DEF: Record<TanweenKind, string> = {
  maqsur: 'الاسم المقصور آخره ألف لازمة',
  manqus: 'الاسم المنقوص آخره ياء لازمة قبلها كسرة',
  mamdud: 'الاسم الممدود آخره همزة بعد ألف',
}

const KIND_END: Record<TanweenKind, string> = {
  maqsur: 'ألف لازمة، فهو اسم مقصور',
  manqus: 'ياء لازمة قبلها كسرة، فهو اسم منقوص',
  mamdud: 'همزة بعد ألف، فهو اسم ممدود',
}

interface TanweenItem {
  id: string
  kind: TanweenKind
  /** الاسم بلا تنوين (لسؤال تحديد النوع) */
  base: string
  /** الجملة وفيها فراغ */
  sentence: string
  right: string
  why: string
  wrongs: [string, string][]
}

const EXTRA_ALEF = 'زدتِ ألف بعد الهمزة، والممدود بيكفيه تنوين الفتح فوق الهمزة من غير ألف.'
const ON_LINE = 'الهمزة جاءت بعد ألف ساكنة، فبتنكتب على السطر.'

const TANWEEN_ITEMS: TanweenItem[] = [
  {
    id: 'm-shifa',
    kind: 'mamdud',
    base: 'شِفَاء',
    sentence: 'طَلَبَ المَرِيضُ ___ مِنَ اللهِ.',
    right: 'شِفَاءً',
    why: 'اسم ممدود منصوب: بنكتب تنوين الفتح فوق الهمزة من غير ألف زيادة.',
    wrongs: [
      ['شِفَاءًا', EXTRA_ALEF],
      ['شِفَاأً', `${ON_LINE} مش على ألف.`],
    ],
  },
  {
    id: 'm-duaa',
    kind: 'mamdud',
    base: 'دُعَاء',
    sentence: 'دَعَوْتُ لِجَدِّي ___ صَادِقًا.',
    right: 'دُعَاءً',
    why: 'اسم ممدود منصوب: تنوين الفتح فوق الهمزة، وما منزيد ألف.',
    wrongs: [
      ['دُعَاءًا', EXTRA_ALEF],
      ['دُعَاأً', `${ON_LINE} مش على ألف.`],
    ],
  },
  {
    id: 'm-maa',
    kind: 'mamdud',
    base: 'مَاء',
    sentence: 'شَرِبْتُ ___ بَارِدًا بَعْدَ الرِّيَاضَةِ.',
    right: 'مَاءً',
    why: 'اسم ممدود منصوب: تنوين الفتح فوق الهمزة، وما منزيد ألف.',
    wrongs: [
      ['مَاءًا', EXTRA_ALEF],
      ['مَاأً', `${ON_LINE} مش على ألف.`],
    ],
  },
  {
    id: 'm-ghidhaa',
    kind: 'mamdud',
    base: 'غِذَاء',
    sentence: 'يَحْتَاجُ جِسْمِي إِلَى ___ مُتَوَازِنٍ.',
    right: 'غِذَاءٍ',
    why: 'اسم ممدود مجرور بـ«إلى»: تنوين الكسر تحت الهمزة اللي على السطر.',
    wrongs: [
      ['غِذَائٍ', `${ON_LINE} مش على نبرة (ياء).`],
      ['غِذَاأٍ', `${ON_LINE} مش على ألف.`],
    ],
  },
  {
    id: 'm-binaa',
    kind: 'mamdud',
    base: 'بِنَاء',
    sentence: 'يَقِفُ أَمَامَ مَدْرَسَتِنَا ___ جَمِيلٌ.',
    right: 'بِنَاءٌ',
    why: 'اسم ممدود مرفوع: تنوين الضم فوق الهمزة اللي على السطر.',
    wrongs: [
      ['بِنَاؤٌ', `${ON_LINE} مش على واو.`],
      ['بِنَاأٌ', `${ON_LINE} مش على ألف.`],
    ],
  },
  {
    id: 'q-hudaa',
    kind: 'maqsur',
    base: 'هُدَى',
    sentence: 'يَسِيرُ المُؤْمِنُ عَلَى ___ مِنْ رَبِّهِ.',
    right: 'هُدًى',
    why: 'اسم مقصور: بنكتب تنوين الفتح على الألف المقصورة، وبيضل نفس الشكل برفع ونصب وجر.',
    wrongs: [
      ['هُدٍ', 'عاملتِيه مثل المنقوص وحذفتِ آخره، بس المقصور بيحافظ على ألفه المقصورة.'],
      ['هُدًا', 'آخر «هُدَى» ألف مقصورة (ى) مش ألف عادية، فما بنغيّر شكلها.'],
    ],
  },
  {
    id: 'q-fata',
    kind: 'maqsur',
    base: 'فَتَى',
    sentence: 'رَأَيْتُ ___ يَلْعَبُ فِي الحَدِيقَةِ.',
    right: 'فَتًى',
    why: 'اسم مقصور: تنوين الفتح على الألف المقصورة بلا تغيير.',
    wrongs: [
      ['فَتٍ', 'عاملتِيه مثل المنقوص وحذفتِ آخره، بس المقصور بيحافظ على ألفه المقصورة.'],
      ['فَتًا', 'آخر «فَتَى» ألف مقصورة (ى) مش ألف عادية، فما بنغيّر شكلها.'],
    ],
  },
  {
    id: 'q-maana',
    kind: 'maqsur',
    base: 'مَعْنَى',
    sentence: 'لِهَذِهِ الكَلِمَةِ ___ جَمِيلٌ.',
    right: 'مَعْنًى',
    why: 'اسم مقصور: تنوين الضم ما بيظهر على آخره، وبنكتب تنوين الفتح على الألف المقصورة.',
    wrongs: [
      ['مَعْنٍ', 'عاملتِيه مثل المنقوص وحذفتِ آخره، بس المقصور بيحافظ على ألفه المقصورة.'],
      ['مَعْنًا', 'آخر «مَعْنَى» ألف مقصورة (ى) مش ألف عادية، فما بنغيّر شكلها.'],
    ],
  },
  {
    id: 'q-mustashfa',
    kind: 'maqsur',
    base: 'مُسْتَشْفَى',
    sentence: 'ذَهَبَ الطَّبِيبُ إِلَى ___ جَدِيدٍ.',
    right: 'مُسْتَشْفًى',
    why: 'اسم مقصور: تنوين الفتح على الألف المقصورة بالجر وبكل الحالات.',
    wrongs: [
      ['مُسْتَشْفٍ', 'عاملتِيه مثل المنقوص وحذفتِ آخره، بس المقصور بيحافظ على ألفه المقصورة.'],
      ['مُسْتَشْفًا', 'آخر «مُسْتَشْفَى» ألف مقصورة (ى) مش ألف عادية، فما بنغيّر شكلها.'],
    ],
  },
  {
    id: 'n-qaadin',
    kind: 'manqus',
    base: 'قَاضِي',
    sentence: 'جَاءَ ___ إِلَى المَجْلِسِ.',
    right: 'قَاضٍ',
    why: 'اسم منقوص مرفوع: بتنحذف ياؤه وبنكتب تنوين الكسر.',
    wrongs: [
      ['قَاضِيٌ', 'المنقوص بالرفع بتنحذف ياؤه، فما بنكتبها.'],
      ['قَاضٌ', 'حذفتِ الياء صح، بس تنوين المنقوص بالرفع والجر تنوين كسر (ٍ) مش ضم.'],
    ],
  },
  {
    id: 'n-raain',
    kind: 'manqus',
    base: 'رَاعِي',
    sentence: 'سَلَّمْتُ عَلَى ___ فِي الحَيِّ.',
    right: 'رَاعٍ',
    why: 'اسم منقوص مجرور: بتنحذف ياؤه وبنكتب تنوين الكسر.',
    wrongs: [
      ['رَاعِيٍ', 'المنقوص بالجر بتنحذف ياؤه، فبنكتب «رَاعٍ» بلا ياء.'],
      ['رَاعِيًا', 'الياء مع تنوين الفتح بتجي بالنصب، وهون الاسم مجرور بـ«على».'],
    ],
  },
  {
    id: 'n-saaqiyan',
    kind: 'manqus',
    base: 'سَاقِي',
    sentence: 'رَأَيْتُ ___ يَسْقِي الشَّجَرَ.',
    right: 'سَاقِيًا',
    why: 'اسم منقوص منصوب: بتثبت ياؤه وبنكتب تنوين الفتح.',
    wrongs: [
      ['سَاقٍ', 'حذف الياء بيصير بالرفع والجر، وهون الاسم منصوب فالياء بتثبت.'],
      ['سَاقًا', 'حذفتِ الياء، والمنقوص المنصوب بتثبت ياؤه وبياخد تنوين الفتح.'],
    ],
  },
  {
    id: 'n-waashin',
    kind: 'manqus',
    base: 'وَاشِي',
    sentence: 'لَا تُصَدِّقِي كَلَامَ ___ يَنْقُلُ النَّمِيمَةَ.',
    right: 'وَاشٍ',
    why: 'اسم منقوص مجرور بالإضافة: بتنحذف ياؤه وبنكتب تنوين الكسر.',
    wrongs: [
      ['وَاشِيٍ', 'المنقوص بالجر بتنحذف ياؤه، فبنكتب «وَاشٍ» بلا ياء.'],
      ['وَاشِيًا', 'تنوين الفتح بيجي بالنصب، وهون الاسم مجرور بالإضافة.'],
    ],
  },
]

function buildQuestion(item: TanweenItem): ChoiceQuestion {
  return choiceQ(
    `s2-tanween-${item.id}`,
    `أكملي الفراغ بالكتابة الصحيحة للتنوين: «${item.sentence}»`,
    [item.right, `صح! ${item.why}`],
    item.wrongs,
  )
}

/** سؤال كتابة التنوين الصحيح (متجدد) */
export function makeTanweenQuestion(): ChoiceQuestion {
  return buildQuestion(pickOne(TANWEEN_ITEMS))
}

/** سؤال تحديد نوع الاسم: مقصور أو منقوص أو ممدود (متجدد) */
export function makeTanweenKindQuestion(): ChoiceQuestion {
  const item = pickOne(TANWEEN_ITEMS.filter((i) => i.id !== 'm-maa'))
  const others = (Object.keys(KIND_LABEL) as TanweenKind[]).filter((k) => k !== item.kind)
  return choiceQ(
    `s2-tanween-kind-${item.id}`,
    `ما نوع الاسم «**${item.base}**»؟`,
    [KIND_LABEL[item.kind], `صح! آخر «${item.base}» ${KIND_END[item.kind]}.`],
    others.map((k): [string, string] => [
      KIND_LABEL[k],
      `${KIND_DEF[k]}، و«${item.base}» آخرها مش هيك.`,
    ]),
  )
}

/** سؤال ثابت من البنك ككتلة درس */
export function tanweenQuiz(id: string): Block {
  const item = TANWEEN_ITEMS.find((i) => i.id === id)
  if (!item) throw new Error(`tanween item not found: ${id}`)
  return { type: 'quiz', question: buildQuestion(item) }
}