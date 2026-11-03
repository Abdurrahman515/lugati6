import type { ChoiceQuestion } from '../../../types'
import type { SortBucket, SortData } from '../../../widgets/SortWidget'
import { choiceQ, makeSortItems } from '../../helpers'
import { pick } from '../../../lib/random'

const W_KEEP = 'هون «ما» استفهامية (سؤال)، فألفها بتنحذف بعد حرف الجر، ويضل الفتح علامة عليها.'
const W_SEP = 'حرف الجر بيتّصل بـ«ما» وبيصيروا كلمة وحدة، فما بنكتبهم منفصلين.'
const W_DEL = 'هون «ما» مش استفهامية (بمعنى «الذي»)، فألفها بتضل وما بتنحذف.'
const W_NUN = 'عند دخول «من» أو «عن» على «ما» أو «مَنْ» بتنقلب النون ميماً وبتندغم بالميم، فما بنكتب النون.'

interface MaItem {
  id: string
  /** الجملة وفيها ___ مكان الكلمة */
  s: string
  right: string
  /** هل «ما» استفهامية؟ */
  q: boolean
  /** هل الكلمة من «من» أو «عن» + «ما»؟ */
  nun?: boolean
  wrongs: [string, string][]
}

const MA: MaItem[] = [
  { id: 'lima', s: '___ تَأَخَّرْتَ عَنِ المَدْرَسَةِ؟', right: 'لِمَ', q: true, wrongs: [['لِمَا', W_KEEP], ['لِ مَا', W_SEP]] },
  { id: 'bima', s: '___ تَشْعُرُ الآنَ؟', right: 'بِمَ', q: true, wrongs: [['بِمَا', W_KEEP], ['بِ مَا', W_SEP]] },
  { id: 'fima', s: '___ تُفَكِّرُ؟', right: 'فِيمَ', q: true, wrongs: [['فِيمَا', W_KEEP], ['فِي مَا', W_SEP]] },
  { id: 'alama', s: '___ تَعْتَمِدُ فِي دِرَاسَتِكَ؟', right: 'عَلَامَ', q: true, wrongs: [['عَلَامَا', W_KEEP], ['عَلَى مَا', W_SEP]] },
  { id: 'ilama', s: '___ تَنْظُرُ؟', right: 'إِلَامَ', q: true, wrongs: [['إِلَامَا', W_KEEP], ['إِلَى مَا', W_SEP]] },
  { id: 'mimma-q', s: '___ صُنِعَ هَذَا الكُوبُ؟', right: 'مِمَّ', q: true, nun: true, wrongs: [['مِمَّا', W_KEEP], ['مِنْ مَا', W_NUN]] },
  { id: 'amma-q', s: '___ تَبْحَثُ فِي الكِتَابِ؟', right: 'عَمَّ', q: true, nun: true, wrongs: [['عَمَّا', W_KEEP], ['عَنْ مَا', W_NUN]] },
  { id: 'fima-n', s: 'اللَّهُمَّ بَارِكْ لِي ___ رَزَقْتَنِي.', right: 'فِيمَا', q: false, wrongs: [['فِيمَ', W_DEL], ['فِي مَا', W_SEP]] },
  { id: 'bima-n', s: 'أَنَا رَاضٍ ___ قَسَمَ اللهُ لِي.', right: 'بِمَا', q: false, wrongs: [['بِمَ', W_DEL], ['بِ مَا', W_SEP]] },
  { id: 'lima-n', s: 'اسْتَمِعْ ___ يَقُولُ المُعَلِّمُ.', right: 'لِمَا', q: false, wrongs: [['لِمَ', W_DEL], ['لِ مَا', W_SEP]] },
  { id: 'amma-n', s: 'ابْتَعِدْ ___ يُؤْذِي النَّاسَ.', right: 'عَمَّا', q: false, nun: true, wrongs: [['عَمَّ', W_DEL], ['عَنْ مَا', W_NUN]] },
  { id: 'mimma-n', s: 'تَصَدَّقْتُ ___ أَمْلِكُ.', right: 'مِمَّا', q: false, nun: true, wrongs: [['مِمَّ', W_DEL], ['مِنْ مَا', W_NUN]] },
]

const rightWhy = (it: MaItem) => {
  if (it.q) return `صح! «ما» هون سؤال، فحُذفت ألفها${it.nun ? '، والنون انقلبت ميماً وانـدغمت بميم «ما»' : ''}، وضل الفتح علامة عليها.`
  return `صح! «ما» هون بمعنى «الذي» مش سؤال، فألفها بتضل${it.nun ? '، والنون انقلبت ميماً وانـدغمت' : ''}.`
}

/** أكملي الفراغ: «ما» استفهامية (تُحذف ألفها) أو غير استفهامية (تبقى ألفها) */
export function makeMaQuestion(): ChoiceQuestion {
  const it = pick(MA)
  return choiceQ(`s2-ma-${it.id}`, `أكملي الفراغ بالكتابة الصحيحة: «${it.s}»`, [it.right, rightWhy(it)], it.wrongs)
}

/** في الجملة المكتوبة: هل «ما» استفهامية؟ وماذا حدث لألفها؟ */
export function makeMaKindQuestion(): ChoiceQuestion {
  const it = pick(MA)
  const A = 'استفهامية، فحُذفت ألفها بعد حرف الجر'
  const B = 'غير استفهامية، فبقيت ألفها'
  const Cc = 'استفهامية، فبقيت ألفها'
  const D = 'غير استفهامية، فحُذفت ألفها'
  const right = it.q ? A : B
  const why = new Map<string, string>([
    [A, it.q ? '' : 'هون «ما» مش استفهامية، بل بمعنى «الذي»، فما بنحذف ألفها.'],
    [B, it.q ? 'هون «ما» سؤال (استفهام)، مش بمعنى «الذي».' : ''],
    [Cc, it.q ? 'استفهامية صح، بس ألفها لازم تنحذف بعد حرف الجر.' : 'هون «ما» مش استفهامية.'],
    [D, it.q ? 'هون «ما» استفهامية، مش غير استفهامية.' : 'غير استفهامية صح، بس ألفها بتضل وما بتنحذف.'],
  ])
  return choiceQ(
    `s2-makind-${it.id}`,
    `في جملة «${it.s.replace('___', `**${it.right}**`)}»: ما نوع «ما»، وماذا حدث لألفها؟`,
    [right, rightWhy(it)],
    [A, B, Cc, D].filter((x) => x !== right).map((x): [string, string] => [x, why.get(x) ?? '']),
  )
}

interface MnItem {
  id: string
  s: string
  right: string
  wrongs: [string, string][]
}

const MN: MnItem[] = [
  { id: 'mimman-q1', s: '___ تَعَلَّمْتَ الخَطَّ؟', right: 'مِمَّنْ', wrongs: [['مِنْ مَنْ', W_NUN], ['مِنْمَنْ', W_NUN]] },
  { id: 'mimman-q2', s: '___ أَخَذْتَ هَذَا الكِتَابَ؟', right: 'مِمَّنْ', wrongs: [['مِنْ مَنْ', W_NUN], ['مِنْمَنْ', W_NUN]] },
  { id: 'mimman-r', s: 'أَسْتَفِيدُ ___ سَبَقُونِي بِالخِبْرَةِ.', right: 'مِمَّنْ', wrongs: [['مِنْ مَنْ', W_NUN], ['مِنْمَنْ', W_NUN]] },
  { id: 'amman-q', s: '___ تَسْأَلُ؟', right: 'عَمَّنْ', wrongs: [['عَنْ مَنْ', W_NUN], ['عَنْمَنْ', W_NUN]] },
  { id: 'amman-r', s: 'ابْتَعِدْ ___ يُؤْذِيكَ.', right: 'عَمَّنْ', wrongs: [['عَنْ مَنْ', W_NUN], ['عَنْمَنْ', W_NUN]] },
]

/** «من» أو «عن» + «مَنْ» (استفهامية أو موصولة): تُقلب النون ميماً وتُدغم */
export function makeMinManQuestion(): ChoiceQuestion {
  const it = pick(MN)
  return choiceQ(
    `s2-mnman-${it.id}`,
    `أكملي الفراغ بالكتابة الصحيحة: «${it.s}»`,
    [it.right, `صح! النون انقلبت ميماً وانـدغمت بميم «مَنْ»، سواء كانت «مَنْ» استفهامية أو موصولة.`],
    it.wrongs,
  )
}

const MA_BUCKETS: SortBucket[] = [
  { id: 'q', label: 'ما استفهامية (تُحذف ألفها)', emoji: '❓' },
  { id: 'n', label: 'ما غير استفهامية (تبقى ألفها)', emoji: '📌' },
]

/** تصنيف جمل بالكلمة مكتوبة بشكلها الصحيح */
export const maKindSort: SortData = {
  prompt: 'هل «ما» في الكلمة اللي بين « » استفهامية أو لا؟ 🧐',
  buckets: MA_BUCKETS,
  items: makeSortItems(
    MA_BUCKETS,
    MA.map((it): [string, string, string] => [
      it.s.replace('___', `«${it.right}»`),
      it.q ? 'q' : 'n',
      it.q ? '«ما» هون سؤال، فألفها بتنحذف بعد حرف الجر.' : '«ما» هون بمعنى «الذي» مش سؤال، فألفها بتضل.',
    ]),
  ),
}