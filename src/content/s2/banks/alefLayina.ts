import type { ChoiceQuestion } from '../../../types'
import type { SortBucket, SortData } from '../../../widgets/SortWidget'
import { choiceQ, makeSortItems } from '../../helpers'
import { pick, randomInt } from '../../../lib/random'

type Grp = 'v3w' | 'v3y' | 'vplus' | 'vy' | 'n3w' | 'n3y' | 'nplus' | 'ny' | 'hq' | 'hy'
type End = 'ا' | 'ى'

interface Entry {
  stem: string
  end: End
  grp: Grp
  /** تلميح لمعرفة الأصل (للثلاثي)، أو جملة فيها __ مكان الحرف (للحروف) */
  clue?: string
}

const E = (grp: Grp, pref: string, rows: [string, End, string?][]): Entry[] =>
  rows.map(([stem, end, clue]) => ({ stem, end, grp, clue: clue ? pref + clue : undefined }))

// ثلاثي أصل ألفه واو → قائمة
const V3W = E('v3w', 'مضارعه: ', [
  ['دَنَ', 'ا', 'يَدْنُو'], ['دَعَ', 'ا', 'يَدْعُو'], ['عَلَ', 'ا', 'يَعْلُو'], ['نَجَ', 'ا', 'يَنْجُو'],
  ['سَمَ', 'ا', 'يَسْمُو'], ['حَبَ', 'ا', 'يَحْبُو'], ['عَفَ', 'ا', 'يَعْفُو'], ['غَزَ', 'ا', 'يَغْزُو'],
  ['شَكَ', 'ا', 'يَشْكُو'], ['مَحَ', 'ا', 'يَمْحُو'], ['رَنَ', 'ا', 'يَرْنُو'], ['قَسَ', 'ا', 'يَقْسُو'], ['طَفَ', 'ا', 'يَطْفُو'],
])
// ثلاثي أصل ألفه ياء → على صورة الياء
const V3Y = E('v3y', 'مضارعه: ', [
  ['حَكَ', 'ى', 'يَحْكِي'], ['هَدَ', 'ى', 'يَهْدِي'], ['رَمَ', 'ى', 'يَرْمِي'], ['بَنَ', 'ى', 'يَبْنِي'],
  ['سَقَ', 'ى', 'يَسْقِي'], ['جَرَ', 'ى', 'يَجْرِي'], ['مَشَ', 'ى', 'يَمْشِي'], ['بَكَ', 'ى', 'يَبْكِي'],
  ['كَفَ', 'ى', 'يَكْفِي'], ['شَفَ', 'ى', 'يَشْفِي'], ['قَضَ', 'ى', 'يَقْضِي'], ['مَضَ', 'ى', 'يَمْضِي'],
  ['شَوَ', 'ى', 'يَشْوِي'], ['كَوَ', 'ى', 'يَكْوِي'], ['رَوَ', 'ى', 'يَرْوِي'], ['أَتَ', 'ى', 'يَأْتِي'],
])
// فوق الثلاثي ولم تسبق الألف بياء → ى
const VPLUS = E('vplus', '', [
  ['اسْتَدْعَ', 'ى'], ['تَوَلَّ', 'ى'], ['انْقَضَ', 'ى'], ['ارْتَدَ', 'ى'], ['اسْتَعْلَ', 'ى'], ['اخْتَفَ', 'ى'],
  ['صَلَّ', 'ى'], ['تَمَنَّ', 'ى'], ['اشْتَرَ', 'ى'], ['انْتَهَ', 'ى'], ['اسْتَوَ', 'ى'], ['أَعْطَ', 'ى'],
  ['أَهْدَ', 'ى'], ['أَمْسَ', 'ى'], ['ابْتَلَ', 'ى'], ['تَحَدَّ', 'ى'], ['ارْتَقَ', 'ى'], ['اهْتَدَ', 'ى'], ['أَبْقَ', 'ى'], ['أَرْضَ', 'ى'],
])
// فوق الثلاثي وسبقت الألف بياء → قائمة
const VY = E('vy', '', [['أَعْيَ', 'ا'], ['أَحْيَ', 'ا'], ['اسْتَحْيَ', 'ا'], ['تَزَيَّ', 'ا'], ['حَيَّ', 'ا']])

const N3W = E('n3w', '', [['عَصَ', 'ا', 'مثناه: عَصَوَان'], ['قَفَ', 'ا', 'مثناه: قَفَوَان'], ['حِجَ', 'ا', 'مثناه: حِجَوَان'], ['ذُرَ', 'ا', 'من نفس الجذر: ذِرْوَة']])
const N3Y = E('n3y', '', [['فَتَ', 'ى', 'مثناه: فَتَيَان'], ['رَحَ', 'ى', 'مثناه: رَحَيَان'], ['أَذَ', 'ى', 'مثناه: أَذَيَان'], ['حَصَ', 'ى', 'جمعه: حَصَيَات']])
const NY = E('ny', '', [['دُنْيَ', 'ا'], ['عُلْيَ', 'ا'], ['سُقْيَ', 'ا'], ['هَدَايَ', 'ا'], ['بَقَايَ', 'ا'], ['مَزَايَ', 'ا'], ['رُؤْيَ', 'ا'], ['ثُرَيَّ', 'ا']])
const NPLUS = E('nplus', '', [
  ['مُنْتَهَ', 'ى'], ['نَجْوَ', 'ى'], ['مُصْطَفَ', 'ى'], ['مُسْتَشْفَ', 'ى'], ['أَقْصَ', 'ى'], ['سَلْوَ', 'ى'], ['مَعْنَ', 'ى'],
  ['ذِكْرَ', 'ى'], ['مُسْتَوَ', 'ى'], ['مَأْوَ', 'ى'], ['أَدْنَ', 'ى'], ['حَلْوَ', 'ى'], ['تَقْوَ', 'ى'], ['عَدْوَ', 'ى'],
  ['شَكْوَ', 'ى'], ['بُشْرَ', 'ى'], ['كُبْرَ', 'ى'], ['صُغْرَ', 'ى'], ['فَتْوَ', 'ى'], ['دَعْوَ', 'ى'],
])

const HQ = E('hq', '', [
  ['لَ', 'ا', 'قَالَ المُعَلِّمُ: __ تَتَأَخَّرْ.'],
  ['أَلَ', 'ا', '__ إِنَّ العِلْمَ نُورٌ.'],
  ['إِلَّ', 'ا', 'مَا نَجَحَ __ المُجْتَهِدُ.'],
  ['لَوْلَ', 'ا', '__ المَطَرُ لَذَهَبْنَا.'],
  ['كَلَّ', 'ا', 'قَالَ الوَلَدُ: __ لَنْ أَكْذِبَ.'],
])
const HY = E('hy', '', [
  ['حَتَّ', 'ى', 'ذَاكَرْتُ __ المَسَاءِ.'],
  ['إِلَ', 'ى', 'ذَهَبْتُ __ المَكْتَبَةِ.'],
  ['عَلَ', 'ى', 'وَضَعْتُ الكِتَابَ __ الطَّاوِلَةِ.'],
  ['بَلَ', 'ى', 'هَلْ أَنْتَ جَاهِزٌ؟ __ أَنَا جَاهِزٌ.'],
])

const S = { A: 'قائمة (ا)', Y: 'على صورة الياء (ى)' } as const
const C = {
  TW: 'الكلمة ثلاثية وأصل ألفها واو',
  TY: 'الكلمة ثلاثية وأصل ألفها ياء',
  PN: 'الكلمة فوق الثلاثي ولم تُسبق ألفها بياء',
  PY: 'الكلمة فوق الثلاثي وسُبقت ألفها بياء',
  HN: 'الحرف ليس من الأربعة (حتى، إلى، على، بلى)',
  HY: 'الحرف من الأربعة (حتى، إلى، على، بلى)',
} as const
type Sh = keyof typeof S
type Cd = keyof typeof C

const opt = (s: Sh, c: Cd) => `${S[s]} — ${C[c]}`

/** الرسم الصحيح لكل مجموعة، وثلاثة خيارات خاطئة (إما الشرط غير صحيح للكلمة أو الرسم لا يوافق الشرط) */
const RULE: Record<Grp, { right: [Sh, Cd]; wrongs: [Sh, Cd][] }> = {
  v3w: { right: ['A', 'TW'], wrongs: [['Y', 'TY'], ['A', 'TY'], ['Y', 'TW']] },
  n3w: { right: ['A', 'TW'], wrongs: [['Y', 'TY'], ['A', 'TY'], ['Y', 'TW']] },
  v3y: { right: ['Y', 'TY'], wrongs: [['A', 'TW'], ['A', 'TY'], ['Y', 'TW']] },
  n3y: { right: ['Y', 'TY'], wrongs: [['A', 'TW'], ['A', 'TY'], ['Y', 'TW']] },
  vplus: { right: ['Y', 'PN'], wrongs: [['A', 'PN'], ['A', 'PY'], ['Y', 'PY']] },
  nplus: { right: ['Y', 'PN'], wrongs: [['A', 'PN'], ['A', 'PY'], ['Y', 'PY']] },
  vy: { right: ['A', 'PY'], wrongs: [['Y', 'PN'], ['Y', 'PY'], ['A', 'PN']] },
  ny: { right: ['A', 'PY'], wrongs: [['Y', 'PN'], ['Y', 'PY'], ['A', 'PN']] },
  hq: { right: ['A', 'HN'], wrongs: [['Y', 'HY'], ['A', 'HY'], ['Y', 'HN']] },
  hy: { right: ['Y', 'HY'], wrongs: [['A', 'HN'], ['A', 'HY'], ['Y', 'HN']] },
}

function ruleQuestion(e: Entry, i: number): ChoiceQuestion {
  const word = e.stem + e.end
  const [rs, rc] = RULE[e.grp].right
  const isHarf = e.grp === 'hq' || e.grp === 'hy'
  const prompt = isHarf
    ? `ما الشكل الصحيح للألف اللينة في آخر الحرف الناقص: «${(e.clue ?? '').replace('__', `**${e.stem}…**`)}»؟`
    : `كيف تُكتب الألف اللينة في آخر ${e.grp.startsWith('v') ? 'الفعل' : 'الاسم'} **${e.stem}…**${e.clue ? ` (${e.clue})` : ''}؟`
  return choiceQ(
    `s2-alef-${e.grp}-${i}`,
    prompt,
    [opt(rs, rc), `صح! «${word}»: ${C[rc]}، فألفها ${S[rs]}.`],
    RULE[e.grp].wrongs.map(([s, c]): [string, string] => [opt(s, c), `مش هيك. الصحيح «${word}»: ${C[rc]}، فألفها ${S[rs]}.`]),
  )
}

const makerFor = (groups: Entry[][]) => (): ChoiceQuestion => {
  const g = pick(groups)
  const i = randomInt(g.length)
  return ruleQuestion(g[i], i)
}

export const makeAlefVerb3Question = makerFor([V3W, V3Y])
export const makeAlefVerbPlusQuestion = makerFor([VPLUS, VY])
export const makeAlefVerbQuestion = makerFor([V3W, V3Y, VPLUS, VY])
export const makeAlefNoun3Question = makerFor([N3W, N3Y])
export const makeAlefNounPlusQuestion = makerFor([NY, NPLUS])
export const makeAlefNounQuestion = makerFor([N3W, N3Y, NY, NPLUS])
export const makeAlefHarfQuestion = makerFor([HQ, HY])

// ---------- أدوات التصنيف ----------

const ALEF_BUCKETS: SortBucket[] = [
  { id: 'a', label: 'قائمة (ا)', emoji: '📏' },
  { id: 'y', label: 'على صورة الياء (ى)', emoji: '🪝' },
]

function rowsOf(list: Entry[]): [string, string, string][] {
  return list.map((e) => {
    const word = e.stem + e.end
    const [rs, rc] = RULE[e.grp].right
    const isHarf = e.grp === 'hq' || e.grp === 'hy'
    const text = isHarf ? (e.clue ?? '').replace('__', `${e.stem}…`) : `${e.stem}…${e.clue ? ` (${e.clue})` : ''}`
    return [text, e.end === 'ا' ? 'a' : 'y', `«${word}»: ${C[rc]}، فبتنكتب ${S[rs]}.`]
  })
}

const sortOf = (prompt: string, list: Entry[]): SortData => ({
  prompt,
  buckets: ALEF_BUCKETS,
  items: makeSortItems(ALEF_BUCKETS, rowsOf(list)),
})

/** دنا، دعا، علا، نجا، حكى، هدى، رمى، بنى */
export const alefVerb3Sort = sortOf('كيف نكتب الألف اللينة؟ دوري على أصلها من المضارع 🔍', [...V3W.slice(0, 4), ...V3Y.slice(0, 4)])
/** استدعى، تولى، انقضى، ارتدى، أعيا، أحيا، استحيا، تزيا */
export const alefVerbPlusSort = sortOf('فعل فوق الثلاثي: هل سبقت الألف ياء؟ 👀', [...VPLUS.slice(0, 4), ...VY.slice(0, 4)])
/** عصا، قفا، فتى، رحى، دنيا، هدايا، سقيا، منتهى، نجوى، مستشفى */
export const alefNounSort = sortOf('كيف نكتب الألف اللينة في هالأسماء؟ 🧩', [
  N3W[0], N3W[1], N3Y[0], N3Y[1], NY[0], NY[3], NY[2], NPLUS[0], NPLUS[1], NPLUS[3],
])
export const alefHarfSort = sortOf('الحروف: أيّها بتنكتب ألفه قائمة وأيّها بالياء؟ 🔤', [...HQ, ...HY])

// ---------- كلمات من سورة عبس: فعل أم اسم ----------

const VERB_NOUN_BUCKETS: SortBucket[] = [
  { id: 'verb', label: 'فعل', emoji: '🏃' },
  { id: 'noun', label: 'اسم', emoji: '🏷️' },
]

/** كلمات منتهية بألف لينة في سورة عبس (ص٧٩) */
export const abasaSort: SortData = {
  prompt: 'كلمات من سورة عبس تنتهي بألف لينة: فعل ولا اسم؟ 📖',
  buckets: VERB_NOUN_BUCKETS,
  items: makeSortItems(VERB_NOUN_BUCKETS, [
    ['تَوَلَّى', 'verb', 'فعل ماضٍ ينتهي بألف لينة.'],
    ['الأَعْمَى', 'noun', 'اسم ينتهي بألف لينة.'],
    ['يَزَّكَّى', 'verb', 'فعل مضارع ينتهي بألف لينة.'],
    ['الذِّكْرَى', 'noun', 'اسم ينتهي بألف لينة.'],
    ['اسْتَغْنَى', 'verb', 'فعل ماضٍ ينتهي بألف لينة.'],
    ['تَصَدَّى', 'verb', 'فعل ماضٍ ينتهي بألف لينة.'],
    ['يَسْعَى', 'verb', 'فعل مضارع ينتهي بألف لينة.'],
    ['يَخْشَى', 'verb', 'فعل مضارع ينتهي بألف لينة.'],
    ['تَلَهَّى', 'verb', 'فعل ماضٍ ينتهي بألف لينة.'],
  ]),
}