import type { Question } from '../../types'
import { choiceQ } from '../helpers'
import { pick, shuffled } from '../../lib/random'

export type Wazn = 'mifaal' | 'mifal' | 'mifala' | 'faila' | 'faal' | 'faala' | 'faul'

/** أوزان اسم الآلة السبعة كما في الكتاب ص١٠٧ */
export const WAZN_LABEL: Record<Wazn, string> = {
  mifaal: 'مِفْعَال',
  mifal: 'مِفْعَل',
  mifala: 'مِفْعَلَة',
  faila: 'فَاعِلَة',
  faal: 'فَعَّال',
  faala: 'فَعَّالَة',
  faul: 'فَاعُول',
}

const WAZN_SHAPE: Record<Wazn, string> = {
  mifaal: 'ميم مكسورة بالأول وألف بعد الحرف الثاني',
  mifal: 'ميم مكسورة بالأول، بدون ألف وبدون تاء مربوطة بالآخر',
  mifala: 'ميم مكسورة بالأول وتاء مربوطة بالآخر',
  faila: 'ألف بعد الفاء، وعين مكسورة، وتاء مربوطة بالآخر',
  faal: 'حرف مشدّد بالوسط وبعده ألف، بدون تاء مربوطة',
  faala: 'حرف مشدّد بالوسط وبعده ألف، وتاء مربوطة بالآخر',
  faul: 'ألف بعد الفاء وواو بعد العين',
}

const WAZNS = Object.keys(WAZN_LABEL) as Wazn[]

export interface Tool {
  verb: string
  tool: string
  wazn: Wazn
}

const t = (verb: string, tool: string, wazn: Wazn): Tool => ({ verb, tool, wazn })

export const TOOLS: Tool[] = [
  t('فَتَحَ', 'مِفْتَاح', 'mifaal'),
  t('نَشَرَ', 'مِنْشَار', 'mifaal'),
  t('حَرَثَ', 'مِحْرَاث', 'mifaal'),
  t('نَظَرَ', 'مِنْظَار', 'mifaal'),
  t('شَرَطَ', 'مِشْرَط', 'mifal'),
  t('صَعِدَ', 'مِصْعَد', 'mifal'),
  t('بَرَدَ', 'مِبْرَد', 'mifal'),
  t('بَضَعَ', 'مِبْضَع', 'mifal'),
  t('لَعَقَ', 'مِلْعَقَة', 'mifala'),
  t('طَحَنَ', 'مِطْحَنَة', 'mifala'),
  t('كَنَسَ', 'مِكْنَسَة', 'mifala'),
  t('سَطَرَ', 'مِسْطَرَة', 'mifala'),
  t('كَشَفَ', 'كَشَّاف', 'faal'),
  t('خَلَطَ', 'خَلَّاط', 'faal'),
  t('غَسَلَ', 'غَسَّالَة', 'faala'),
  t('حَصَدَ', 'حَصَّادَة', 'faala'),
  t('ثَلَجَ', 'ثَلَّاجَة', 'faala'),
  t('طَبَعَ', 'طَابِعَة', 'faila'),
  t('رَفَعَ', 'رَافِعَة', 'faila'),
  t('حَسَبَ', 'حَاسُوب', 'faul'),
]

export function byTool(verb: string): Tool {
  const found = TOOLS.find((x) => x.verb === verb)
  if (!found) throw new Error(`الفعل غير موجود في البنك: ${verb}`)
  return found
}

export function alatToolQuestion(x: Tool): Question {
  const others = shuffled(TOOLS.filter((o) => o.verb !== x.verb)).slice(0, 2)
  return choiceQ(
    `alat-tool-${x.verb}`,
    `ما **اسم الآلة** المشتق من الفعل «${x.verb}»؟`,
    [x.tool, `أحسنتِ! «${x.tool}» اسم آلة من «${x.verb}»، على وزن ${WAZN_LABEL[x.wazn]}.`],
    others.map((o): [string, string] => [o.tool, `«${o.tool}» كمان اسم آلة، بس من الفعل «${o.verb}» مش «${x.verb}».`]),
  )
}

export function alatVerbQuestion(x: Tool): Question {
  const others = shuffled(TOOLS.filter((o) => o.verb !== x.verb)).slice(0, 2)
  return choiceQ(
    `alat-verb-${x.tool}`,
    `من أي فعل اشتُقّ اسم الآلة **${x.tool}**؟`,
    [x.verb, `أحسنتِ! «${x.tool}» أداة بنستعملها لهالفعل: ${x.verb}.`],
    others.map((o): [string, string] => [o.verb, `«${o.verb}» بيعطينا «${o.tool}» مش «${x.tool}».`]),
  )
}

export function alatWaznQuestion(x: Tool): Question {
  const others = shuffled(WAZNS.filter((w) => w !== x.wazn)).slice(0, 3)
  return choiceQ(
    `alat-wazn-${x.tool}`,
    `ما وزن اسم الآلة **${x.tool}**؟`,
    [WAZN_LABEL[x.wazn], `أحسنتِ! «${x.tool}» على وزن ${WAZN_LABEL[x.wazn]}: ${WAZN_SHAPE[x.wazn]}.`],
    others.map((w): [string, string] => [
      WAZN_LABEL[w],
      `وزن ${WAZN_LABEL[w]}: ${WAZN_SHAPE[w]}. أما «${x.tool}» فوزنها ${WAZN_LABEL[x.wazn]}: ${WAZN_SHAPE[x.wazn]}.`,
    ]),
  )
}

export function makeAlatQuestion(): Question {
  const x = pick(TOOLS)
  const mode = pick(['tool', 'verb', 'wazn'] as const)
  return mode === 'tool' ? alatToolQuestion(x) : mode === 'verb' ? alatVerbQuestion(x) : alatWaznQuestion(x)
}