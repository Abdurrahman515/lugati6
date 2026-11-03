import type { ChoiceQuestion } from '../../../types'
import type { SortBucket, SortData } from '../../../widgets/SortWidget'
import { choiceQ, makeSortItems } from '../../helpers'
import { pick, shuffled } from '../../../lib/random'

export type Mood = 'raf' | 'nasb' | 'jazm'
export type VType = 'sahih' | 'alif' | 'waw' | 'ya' | 'khamsa'

interface Sign {
  id: string
  label: string
  emoji: string
}

const SIGNS: Record<Mood, Sign[]> = {
  raf: [
    { id: 'zahira', label: 'الضمة الظاهرة', emoji: '🟢' },
    { id: 'taadhur', label: 'الضمة المقدرة للتعذر', emoji: '🟠' },
    { id: 'thiql', label: 'الضمة المقدرة للثقل', emoji: '🟣' },
    { id: 'nun', label: 'ثبوت النون', emoji: '🔵' },
  ],
  nasb: [
    { id: 'zahira', label: 'الفتحة الظاهرة', emoji: '🟢' },
    { id: 'muqaddara', label: 'الفتحة المقدرة', emoji: '🟠' },
    { id: 'nun', label: 'حذف النون', emoji: '🔵' },
  ],
  jazm: [
    { id: 'sukun', label: 'السكون', emoji: '⏸️' },
    { id: 'hadhf', label: 'حذف حرف العلة', emoji: '✂️' },
    { id: 'nun', label: 'حذف النون', emoji: '🔵' },
  ],
}

const ACT: Record<Mood, string> = { raf: 'رفع', nasb: 'نصب', jazm: 'جزم' }
const STATE: Record<Mood, string> = { raf: 'مرفوع', nasb: 'منصوب', jazm: 'مجزوم' }

const TYPE_DESC: Record<VType, string> = {
  sahih: 'صحيح الآخر',
  alif: 'معتل الآخر بالألف',
  waw: 'معتل الآخر بالواو',
  ya: 'معتل الآخر بالياء',
  khamsa: 'من الأفعال الخمسة',
}

function signOf(mood: Mood, t: VType): string {
  if (t === 'khamsa') return 'nun'
  if (mood === 'raf') return t === 'sahih' ? 'zahira' : t === 'alif' ? 'taadhur' : 'thiql'
  if (mood === 'nasb') return t === 'alif' ? 'muqaddara' : 'zahira'
  return t === 'sahih' ? 'sukun' : 'hadhf'
}

const labelOf = (m: Mood, id: string) => SIGNS[m].find((s) => s.id === id)?.label ?? ''

interface Entry {
  mood: Mood
  /** حرف النصب أو الجزم (فارغ في الرفع) */
  part: string
  /** الجملة */
  s: string
  /** الفعل المضارع المقصود بتشكيله في الجملة */
  v: string
  t: VType
}

const mk = (mood: Mood, part: string, s: string, v: string, t: VType): Entry => ({ mood, part, s, v, t })

const RAF: Entry[] = [
  mk('raf', '', 'يَحْتَرِمُ الطَّالِبُ مُعَلِّمَهُ.', 'يَحْتَرِمُ', 'sahih'),
  mk('raf', '', 'تَشْرَحُ المُعَلِّمَةُ الدَّرْسَ.', 'تَشْرَحُ', 'sahih'),
  mk('raf', '', 'أَقْرَأُ قِصَّةً كُلَّ لَيْلَةٍ.', 'أَقْرَأُ', 'sahih'),
  mk('raf', '', 'يَنَامُ الطِّفْلُ مُبَكِّرًا.', 'يَنَامُ', 'sahih'),
  mk('raf', '', 'يَسْعَى الطَّبِيبُ إِلَى شِفَاءِ المَرْضَى.', 'يَسْعَى', 'alif'),
  mk('raf', '', 'يَرْضَى الأَبُ عَنِ ابْنِهِ المُجْتَهِدِ.', 'يَرْضَى', 'alif'),
  mk('raf', '', 'تَخْشَى الأُمُّ عَلَى أَبْنَائِهَا.', 'تَخْشَى', 'alif'),
  mk('raf', '', 'يَدْعُو المُؤْمِنُ رَبَّهُ.', 'يَدْعُو', 'waw'),
  mk('raf', '', 'يَسْمُو الطَّالِبُ بِأَخْلَاقِهِ.', 'يَسْمُو', 'waw'),
  mk('raf', '', 'أَرْجُو لَكَ الشِّفَاءَ.', 'أَرْجُو', 'waw'),
  mk('raf', '', 'يَجْرِي الوَلَدُ فِي الحَدِيقَةِ.', 'يَجْرِي', 'ya'),
  mk('raf', '', 'يَقِي الغِذَاءُ الصَّحِيُّ الجِسْمَ مِنَ الأَمْرَاضِ.', 'يَقِي', 'ya'),
  mk('raf', '', 'تَبْنِي الأُمُّ بَيْتًا سَعِيدًا.', 'تَبْنِي', 'ya'),
  mk('raf', '', 'الطُّلَّابُ يَذْهَبُونَ إِلَى المَدْرَسَةِ.', 'يَذْهَبُونَ', 'khamsa'),
  mk('raf', '', 'الوَلَدَانِ يَلْعَبَانِ فِي الحَدِيقَةِ.', 'يَلْعَبَانِ', 'khamsa'),
  mk('raf', '', 'أَنْتِ تَكْتُبِينَ الوَاجِبَ.', 'تَكْتُبِينَ', 'khamsa'),
  mk('raf', '', 'أَنْتُمْ تُحَافِظُونَ عَلَى صِحَّتِكُمْ.', 'تُحَافِظُونَ', 'khamsa'),
  mk('raf', '', 'الأَبَوَانِ يَخْتَارَانِ الأَطْعِمَةَ الطَّازِجَةَ.', 'يَخْتَارَانِ', 'khamsa'),
]

const NASB: Entry[] = [
  mk('nasb', 'أَنْ', 'يَجِبُ أَنْ نَحْتَرِمَ الكَبِيرَ.', 'نَحْتَرِمَ', 'sahih'),
  mk('nasb', 'أَنْ', 'أُحِبُّ أَنْ أَقْرَأَ كُلَّ يَوْمٍ.', 'أَقْرَأَ', 'sahih'),
  mk('nasb', 'أَنْ', 'نَرْجُو أَنْ يَسْمُوَ وَطَنُنَا.', 'يَسْمُوَ', 'waw'),
  mk('nasb', 'أَنْ', 'يَسُرُّنِي أَنْ تَقْضِيَ وَقْتَكَ فِي القِرَاءَةِ.', 'تَقْضِيَ', 'ya'),
  mk('nasb', 'أَنْ', 'تُرِيدُ نُورَةُ أَنْ تَسْعَى لِلْخَيْرِ.', 'تَسْعَى', 'alif'),
  mk('nasb', 'لَنْ', 'لَنْ يَذْهَبَ الأَطْفَالُ إِلَى الحَدِيقَةِ اليَوْمَ.', 'يَذْهَبَ', 'sahih'),
  mk('nasb', 'لَنْ', 'لَنْ يَنْسَى الطَّالِبُ نَصِيحَةَ مُعَلِّمِهِ.', 'يَنْسَى', 'alif'),
  mk('nasb', 'لَنْ', 'لَنْ تَنَالَ المَجْدَ بِالكَسَلِ.', 'تَنَالَ', 'sahih'),
  mk('nasb', 'لَنْ', 'المُؤْمِنُونَ لَنْ يَكْذِبُوا أَبَدًا.', 'يَكْذِبُوا', 'khamsa'),
  mk('nasb', 'لَنْ', 'أَنْتِ لَنْ تُهْمِلِي دُرُوسَكِ.', 'تُهْمِلِي', 'khamsa'),
  mk('nasb', 'كَيْ', 'نَمْ مُبَكِّرًا كَيْ تَصْحُوَ نَشِيطًا.', 'تَصْحُوَ', 'waw'),
  mk('nasb', 'كَيْ', 'يَدْرُسُ الطَّالِبُ كَيْ يَنْجَحَ.', 'يَنْجَحَ', 'sahih'),
  mk('nasb', 'كَيْ', 'يَأْكُلُ الأَطْفَالُ الفَوَاكِهَ كَيْ يَنْمُوا نُمُوًّا سَلِيمًا.', 'يَنْمُوا', 'khamsa'),
  mk('nasb', 'كَيْ', 'الوَالِدَانِ يَعْمَلَانِ كَيْ يُوَفِّرَا لَنَا حَيَاةً هَانِئَةً.', 'يُوَفِّرَا', 'khamsa'),
  mk('nasb', 'كَيْ', 'نَتَعَاوَنُ كَيْ نَرْقَى بِمُجْتَمَعِنَا.', 'نَرْقَى', 'alif'),
  mk('nasb', 'كَيْ', 'يَدْرُسُ الطَّبِيبُ كَيْ يَشْفِيَ المَرْضَى.', 'يَشْفِيَ', 'ya'),
]

const NA = 'لَا الناهية'
const LA = 'لَامُ الأمر'

const JAZM: Entry[] = [
  mk('jazm', 'لَمْ', 'لَمْ يَكْتُبْ أَحْمَدُ وَاجِبَهُ.', 'يَكْتُبْ', 'sahih'),
  mk('jazm', 'لَمْ', 'لَمْ تَحْضُرْ سَلْمَى إِلَى الحَفْلِ.', 'تَحْضُرْ', 'sahih'),
  mk('jazm', 'لَمْ', 'لَمْ يَسْعَ زَيْدٌ فِي إِيذَاءِ أَحَدٍ.', 'يَسْعَ', 'alif'),
  mk('jazm', 'لَمْ', 'لَمْ يَدْعُ عَلِيٌّ أَحَدًا إِلَى الخِصَامِ.', 'يَدْعُ', 'waw'),
  mk('jazm', 'لَمْ', 'لَمْ يَرْمِ خَالِدٌ الطَّعَامَ فِي الأَرْضِ.', 'يَرْمِ', 'ya'),
  mk('jazm', 'لَمْ', 'لَمْ يَقْضِ القَاضِي إِلَّا بِالحَقِّ.', 'يَقْضِ', 'ya'),
  mk('jazm', 'لَمْ', 'لَمْ يُقَصِّرَا فِي تَوْجِيهِ أَبْنَائِهِمَا.', 'يُقَصِّرَا', 'khamsa'),
  mk('jazm', 'لَمْ', 'لَمْ يُهْمِلُوا دُرُوسَهُمْ.', 'يُهْمِلُوا', 'khamsa'),
  mk('jazm', NA, 'لَا تُقَصِّرْ فِي وَاجِبِكَ.', 'تُقَصِّرْ', 'sahih'),
  mk('jazm', NA, 'لَا تَسْعَ فِي النَّمِيمَةِ.', 'تَسْعَ', 'alif'),
  mk('jazm', NA, 'لَا تَدْعُ إِلَّا اللهَ.', 'تَدْعُ', 'waw'),
  mk('jazm', NA, 'لَا تَرْمِ قِشْرَ المَوْزِ عَلَى الأَرْضِ.', 'تَرْمِ', 'ya'),
  mk('jazm', NA, 'لَا تُسْرِفُوا فِي تَنَاوُلِ الحَلْوَى.', 'تُسْرِفُوا', 'khamsa'),
  mk('jazm', NA, 'لَا تَكْذِبِي عَلَى أُمِّكِ.', 'تَكْذِبِي', 'khamsa'),
  mk('jazm', LA, 'لِيَكْتُبْ كُلُّ طَالِبٍ وَاجِبَهُ.', 'يَكْتُبْ', 'sahih'),
  mk('jazm', LA, 'لِتَحْرِصْ عَلَى مُمَارَسَةِ الرِّيَاضَةِ.', 'تَحْرِصْ', 'sahih'),
  mk('jazm', LA, 'لِيَدْعُ المُسْلِمُ رَبَّهُ فِي اليُسْرِ وَالعُسْرِ.', 'يَدْعُ', 'waw'),
  mk('jazm', LA, 'لِتَسْعَ إِلَى الخَيْرِ.', 'تَسْعَ', 'alif'),
  mk('jazm', LA, 'لِيَرْمِ الطَّالِبُ الوَرَقَةَ فِي السَّلَّةِ.', 'يَرْمِ', 'ya'),
  mk('jazm', LA, 'لِتُسَاعِدِي أُمَّكِ فِي عَمَلِ المَنْزِلِ.', 'تُسَاعِدِي', 'khamsa'),
]

const ALL: Entry[] = [...RAF, ...NASB, ...JAZM]

function rightWhy(e: Entry): string {
  const lab = labelOf(e.mood, signOf(e.mood, e.t))
  if (e.mood === 'nasb' && (e.t === 'waw' || e.t === 'ya'))
    return `«${e.v}» ${TYPE_DESC[e.t]}، بس الفتحة خفيفة فبتظهر عليه، فعلامة نصبه ${lab}.`
  return `«${e.v}» ${TYPE_DESC[e.t]}، فعلامة ${ACT[e.mood]}ه ${lab}.`
}

function whyNotSign(mood: Mood, chosen: string, t: VType, v: string): string {
  if (chosen === 'nun')
    return `«${v}» ما اتصلت فيه ألف اثنين ولا واو جماعة ولا ياء مخاطبة، فهو مش من الأفعال الخمسة.`
  if (t === 'khamsa')
    return `«${v}» من الأفعال الخمسة، فعلامة ${ACT[mood]}ه ${mood === 'raf' ? 'ثبوت' : 'حذف'} النون.`
  if (mood === 'raf') {
    if (chosen === 'zahira')
      return t === 'alif'
        ? `آخر «${v}» ألف، والألف يستحيل النطق بحركة عليها، فالضمة مقدرة للتعذر مش ظاهرة.`
        : `آخر «${v}» ${t === 'waw' ? 'واو' : 'ياء'}، والضمة ثقيلة عليها فبتتقدر مش بتظهر.`
    if (chosen === 'taadhur')
      return t === 'sahih'
        ? `آخر «${v}» حرف صحيح فبتظهر عليه الضمة؛ التعذر بيكون مع الألف بس.`
        : `التعذر (استحالة النطق) بيكون مع الألف بس؛ أما الواو والياء ففيهم ثقل مش استحالة.`
    return t === 'sahih'
      ? `الثقل بيكون مع الواو والياء، وآخر «${v}» حرف صحيح فبتظهر عليه الضمة.`
      : `الثقل بيكون مع الواو والياء، أما الألف فبتستحيل الحركة عليها، وهاد اسمه تعذر.`
  }
  if (mood === 'nasb') {
    if (chosen === 'zahira') return `آخر «${v}» ألف، والألف ما بتظهر عليها حركة، فالفتحة مقدرة مش ظاهرة.`
    return `الفتحة بتظهر على الحرف الصحيح وعلى الواو والياء لخفتها، وبتتقدر بس على الألف، وهون «${v}» ${TYPE_DESC[t]}.`
  }
  if (chosen === 'sukun')
    return `«${v}» ${TYPE_DESC[t]}، والمعتل الآخر بيُجزم بحذف حرف العلة مش بالسكون.`
  return `«${v}» ${TYPE_DESC[t]}، وآخره حرف صحيح ما في حرف علة بينحذف، فعلامة جزمه السكون.`
}

function signQuestion(e: Entry): ChoiceQuestion {
  const signs = SIGNS[e.mood]
  const right = signOf(e.mood, e.t)
  return choiceQ(
    `s2-sign-${ALL.indexOf(e)}`,
    `ما علامة ${ACT[e.mood]} الفعل المضارع «**${e.v}**» في الجملة: «${e.s}»؟`,
    [labelOf(e.mood, right), `صح! ${rightWhy(e)}`],
    signs.filter((s) => s.id !== right).map((s): [string, string] => [s.label, whyNotSign(e.mood, s.id, e.t, e.v)]),
  )
}

export const makeRafSignQuestion = (): ChoiceQuestion => signQuestion(pick(RAF))
export const makeNasbSignQuestion = (): ChoiceQuestion => signQuestion(pick(NASB))
export const makeJazmSignQuestion = (): ChoiceQuestion => signQuestion(pick(JAZM))
/** علامة الإعراب في أي حالة (للتدريب الشامل والمراجعة) */
export const makeSignQuestion = (): ChoiceQuestion => signQuestion(pick(ALL))

/** مرفوع أم منصوب أم مجزوم؟ */
export function makeMoodQuestion(): ChoiceQuestion {
  const e = pick(ALL)
  const rightWhyText =
    e.mood === 'raf'
      ? 'ما سبقه حرف نصب ولا حرف جزم، والأصل في المضارع الرفع.'
      : `سبقه حرف ${e.mood === 'nasb' ? 'النصب' : 'الجزم'} «${e.part}»، فهو ${STATE[e.mood]}.`
  const wrongs = (['raf', 'nasb', 'jazm'] as Mood[])
    .filter((m) => m !== e.mood)
    .map((m): [string, string] => {
      if (m === 'raf') return [STATE.raf, `الأصل الرفع، بس سبقه «${e.part}» وهو حرف ${e.mood === 'nasb' ? 'نصب' : 'جزم'} فتغيّرت حالته.`]
      if (m === 'nasb')
        return [STATE.nasb, e.mood === 'raf' ? 'ما في قبله حرف نصب (أَنْ، لَنْ، كَيْ).' : `«${e.part}» حرف جزم مش حرف نصب.`]
      return [STATE.jazm, e.mood === 'raf' ? 'ما في قبله حرف جزم (لَمْ، لَا الناهية، لَامُ الأمر).' : `«${e.part}» حرف نصب مش حرف جزم.`]
    })
  return choiceQ(
    `s2-mood-${ALL.indexOf(e)}`,
    `ما حالة الفعل المضارع «**${e.v}**» الإعرابية في الجملة: «${e.s}»؟`,
    [STATE[e.mood], `صح! «${e.v}»: ${rightWhyText}`],
    wrongs,
  )
}

const NASB_PARTS = ['أَنْ', 'لَنْ', 'كَيْ']

export function makeNasbParticleQuestion(): ChoiceQuestion {
  const e = pick(NASB)
  const others = shuffled(NASB_PARTS.filter((p) => p !== e.part)).slice(0, 2)
  const wrongs: [string, string][] = [
    ...others.map((p): [string, string] => [p, `«${p}» حرف نصب فعلاً، بس مش هو اللي سبق «${e.v}» بالجملة.`]),
    ['سَوْفَ', '«سَوْفَ» حرف استقبال بيدخل على المضارع بس ما بينصبه.'],
  ]
  return choiceQ(
    `s2-nparticle-${NASB.indexOf(e)}`,
    `ما حرف النصب الذي سبق الفعل «**${e.v}**» في الجملة: «${e.s}»؟`,
    [e.part, `صح! «${e.part}» حرف نصب سبق «${e.v}» فنصبه.`],
    wrongs,
  )
}

const NASB_MEANING: Record<string, string> = { 'لَنْ': 'نفي الفعل في المستقبل', 'كَيْ': 'بيان العلة (سبب حدوث الفعل)' }

export function makeNasbMeaningQuestion(): ChoiceQuestion {
  const pool = NASB.filter((e) => e.part !== 'أَنْ')
  const e = pick(pool)
  const right = NASB_MEANING[e.part]
  const other = e.part === 'لَنْ' ? 'كَيْ' : 'لَنْ'
  return choiceQ(
    `s2-nmean-${NASB.indexOf(e)}`,
    `ماذا أفاد الحرف «**${e.part}**» في الجملة: «${e.s}»؟`,
    [right, e.part === 'لَنْ' ? 'صح! «لَنْ» بتنفي حدوث الفعل بالمستقبل.' : 'صح! «كَيْ» بتبيّن سبب حدوث الفعل، وهاد اسمه بيان العلة.'],
    [
      [NASB_MEANING[other], `هذا معنى «${other}»، أما «${e.part}» فتفيد ${right}.`],
      ['الأمر (طلب القيام بالفعل)', 'الأمر مش من معاني حروف النصب؛ هو من معاني «لَامُ الأمر» وهي حرف جزم.'],
    ],
  )
}

const JAZM_MEANING: Record<string, string> = {
  'لَمْ': 'نفي الفعل في الماضي',
  [NA]: 'النهي (طلب ترك الفعل)',
  [LA]: 'الأمر (طلب القيام بالفعل)',
}

export function makeJazmMeaningQuestion(): ChoiceQuestion {
  const e = pick(JAZM)
  const right = JAZM_MEANING[e.part]
  return choiceQ(
    `s2-jmean-${JAZM.indexOf(e)}`,
    `ماذا أفاد حرف الجزم «**${e.part}**» في الجملة: «${e.s}»؟`,
    [right, `صح! «${e.part}» بتفيد ${right}.`],
    Object.keys(JAZM_MEANING)
      .filter((p) => p !== e.part)
      .map((p): [string, string] => [JAZM_MEANING[p], `هذا معنى «${p}»، أما «${e.part}» فتفيد ${right}.`]),
  )
}

const KHAMSA_VERBS: [string, number][] = [
  ['يَلْعَبَانِ', 0],
  ['تَدْرُسَانِ', 0],
  ['يَذْهَبُونَ', 1],
  ['تَفْهَمُونَ', 1],
  ['تَكْتُبِينَ', 2],
  ['تَسْمَعِينَ', 2],
]
const KHAMSA_NAMES = ['ألف الاثنين', 'واو الجماعة', 'ياء المخاطبة']
const KHAMSA_EX = ['يَكْتُبَانِ', 'يَكْتُبُونَ', 'تَكْتُبِينَ']

export function makeKhamsaQuestion(): ChoiceQuestion {
  const i = Math.floor(Math.random() * KHAMSA_VERBS.length)
  const [v, k] = KHAMSA_VERBS[i]
  return choiceQ(
    `s2-khamsa-${i}`,
    `ما الذي اتصل بالفعل المضارع «**${v}**» فجعله من الأفعال الخمسة؟`,
    [KHAMSA_NAMES[k], `صح! اتصلت بـ«${v}» ${KHAMSA_NAMES[k]}، وهي من الثلاثة اللي بتصنع الأفعال الخمسة.`],
    KHAMSA_NAMES.map((n, j): [string, number] => [n, j])
      .filter(([, j]) => j !== k)
      .map(([n, j]): [string, string] => [n, `${n} بتظهر بأفعال مثل «${KHAMSA_EX[j]}»، أما «${v}» فاتصلت فيه ${KHAMSA_NAMES[k]}.`]),
  )
}

function signSort(mood: Mood, prompt: string, rows: [string, VType][]): SortData {
  const buckets: SortBucket[] = SIGNS[mood].map((s) => ({ id: s.id, label: s.label, emoji: s.emoji }))
  return {
    prompt,
    buckets,
    items: makeSortItems(
      buckets,
      rows.map(([text, t]): [string, string, string] => [
        text,
        signOf(mood, t),
        `«${text}» ${TYPE_DESC[t]}، فعلامة ${ACT[mood]}ه ${labelOf(mood, signOf(mood, t))}.`,
      ]),
    ),
  }
}

export const rafSignSort: SortData = signSort('raf', 'شو علامة رفع هالفعل المضارع؟ ركّزي على آخره 👀', [
  ['يَكْتُبُ', 'sahih'],
  ['يَقْرَأُ', 'sahih'],
  ['يَرْضَى', 'alif'],
  ['يَسْعَى', 'alif'],
  ['يَدْعُو', 'waw'],
  ['يَسْمُو', 'waw'],
  ['يَجْرِي', 'ya'],
  ['يَهْدِي', 'ya'],
  ['يَكْتُبُونَ', 'khamsa'],
  ['يَكْتُبَانِ', 'khamsa'],
  ['تَكْتُبِينَ', 'khamsa'],
])

export const nasbSignSort: SortData = signSort('nasb', 'شو علامة نصب هالفعل بعد حرف النصب؟ 🎯', [
  ['لَنْ يَذْهَبَ', 'sahih'],
  ['أَنْ يَكْتُبَ', 'sahih'],
  ['كَيْ يَسْمُوَ', 'waw'],
  ['أَنْ يَقْضِيَ', 'ya'],
  ['أَنْ نَخْشَى', 'alif'],
  ['لَنْ يَرْضَى', 'alif'],
  ['كَيْ تَسْعَى', 'alif'],
  ['لَنْ تَذْهَبِي', 'khamsa'],
  ['لَنْ يَذْهَبَا', 'khamsa'],
  ['لَنْ يَذْهَبُوا', 'khamsa'],
])

export const jazmSignSort: SortData = signSort('jazm', 'شو علامة جزم هالفعل بعد حرف الجزم؟ ✂️', [
  ['لَمْ يَكْتُبْ', 'sahih'],
  ['لَا تَحْضُرْ', 'sahih'],
  ['لِتَحْرِصْ', 'sahih'],
  ['لَا تَسْعَ', 'alif'],
  ['لَمْ يَدْعُ', 'waw'],
  ['لَمْ يَرْمِ', 'ya'],
  ['لَمْ يَقْضِ', 'ya'],
  ['لَا تُسْرِفُوا', 'khamsa'],
  ['لَمْ يُقَصِّرَا', 'khamsa'],
  ['لِتُسَاعِدِي', 'khamsa'],
])

const MOOD_BUCKETS: SortBucket[] = [
  { id: 'raf', label: 'مرفوع', emoji: '⬆️' },
  { id: 'nasb', label: 'منصوب', emoji: '➡️' },
  { id: 'jazm', label: 'مجزوم', emoji: '✂️' },
]

export const moodSort: SortData = {
  prompt: 'الفعل المضارع في هالجملة: مرفوع ولا منصوب ولا مجزوم؟ انتبهي لما قبله 🧐',
  buckets: MOOD_BUCKETS,
  items: makeSortItems(MOOD_BUCKETS, [
    ['الطَّالِبُ يَكْتُبُ الوَاجِبَ.', 'raf', 'ما قبل الفعل حرف نصب ولا جزم، فهو مرفوع على الأصل.'],
    ['تَطْبُخُ الأُمُّ العَشَاءَ.', 'raf', 'ما قبل الفعل حرف نصب ولا جزم، فهو مرفوع على الأصل.'],
    ['الأَطْفَالُ يَلْعَبُونَ فِي الحَدِيقَةِ.', 'raf', 'ما قبل الفعل حرف نصب ولا جزم، فهو مرفوع بثبوت النون.'],
    ['الطَّالِبُ لَنْ يَكْتُبَ الوَاجِبَ.', 'nasb', 'سبقه «لَنْ» وهو حرف نصب.'],
    ['تَسْتَيْقِظُ الأُمُّ كَيْ تَطْبُخَ العَشَاءَ.', 'nasb', 'سبقه «كَيْ» وهو حرف نصب.'],
    ['يُحِبُّ الأَطْفَالُ أَنْ يَلْعَبُوا فِي الحَدِيقَةِ.', 'nasb', 'سبقه «أَنْ» وهو حرف نصب، وحُذفت نونه.'],
    ['الطَّالِبُ لَمْ يَكْتُبْ وَاجِبَهُ.', 'jazm', 'سبقه «لَمْ» وهو حرف جزم.'],
    ['لِتَطْبُخْ أُمِّي العَشَاءَ.', 'jazm', 'سبقه «لَامُ الأمر» وهو حرف جزم.'],
    ['الأَطْفَالُ لَمْ يَلْعَبُوا فِي الحَدِيقَةِ.', 'jazm', 'سبقه «لَمْ» وهو حرف جزم، وحُذفت نونه.'],
  ]),
}