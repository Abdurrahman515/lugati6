import type { Block, ChoiceQuestion } from '../../../types'
import { choiceQ } from '../../helpers'
import { pickOne, shuffled } from './util'

interface MizanItem {
  id: string
  word: string
  root: [string, string, string]
  wazn: string
}

const WAZN_LIST = [
  'فَاعِل',
  'مَفْعُول',
  'مَفْعَل',
  'مَفْعِل',
  'مَفْعَلَة',
  'مِفْعَل',
  'مِفْعَال',
  'مِفْعَلَة',
  'فَعَّال',
  'فَعَّالَة',
]

/** كلمة مثال لكل وزن، تُستعمل في تفسير الخيارات الخاطئة */
const WAZN_EXAMPLE: Record<string, string> = {
  'فَاعِل': 'كَاتِب',
  'مَفْعُول': 'مَكْتُوب',
  'مَفْعَل': 'مَكْتَب',
  'مَفْعِل': 'مَوْعِد',
  'مَفْعَلَة': 'مَدْرَسَة',
  'مِفْعَل': 'مِجْهَر',
  'مِفْعَال': 'مِذْيَاع',
  'مِفْعَلَة': 'مِطْرَقَة',
  'فَعَّال': 'خَيَّاط',
  'فَعَّالَة': 'غَسَّالَة',
}

const MIZAN_ITEMS: MizanItem[] = [
  { id: 'katib', word: 'كَاتِب', root: ['ك', 'ت', 'ب'], wazn: 'فَاعِل' },
  { id: 'aalim', word: 'عَالِم', root: ['ع', 'ل', 'م'], wazn: 'فَاعِل' },
  { id: 'maktub', word: 'مَكْتُوب', root: ['ك', 'ت', 'ب'], wazn: 'مَفْعُول' },
  { id: 'maftuh', word: 'مَفْتُوح', root: ['ف', 'ت', 'ح'], wazn: 'مَفْعُول' },
  { id: 'maktab', word: 'مَكْتَب', root: ['ك', 'ت', 'ب'], wazn: 'مَفْعَل' },
  { id: 'malab', word: 'مَلْعَب', root: ['ل', 'ع', 'ب'], wazn: 'مَفْعَل' },
  { id: 'matbakh', word: 'مَطْبَخ', root: ['ط', 'ب', 'خ'], wazn: 'مَفْعَل' },
  { id: 'mawid', word: 'مَوْعِد', root: ['و', 'ع', 'د'], wazn: 'مَفْعِل' },
  { id: 'masjid', word: 'مَسْجِد', root: ['س', 'ج', 'د'], wazn: 'مَفْعِل' },
  { id: 'madrasa', word: 'مَدْرَسَة', root: ['د', 'ر', 'س'], wazn: 'مَفْعَلَة' },
  { id: 'mijhar', word: 'مِجْهَر', root: ['ج', 'ه', 'ر'], wazn: 'مِفْعَل' },
  { id: 'mibrad', word: 'مِبْرَد', root: ['ب', 'ر', 'د'], wazn: 'مِفْعَل' },
  { id: 'miftah', word: 'مِفْتَاح', root: ['ف', 'ت', 'ح'], wazn: 'مِفْعَال' },
  { id: 'midhyaa', word: 'مِذْيَاع', root: ['ذ', 'ي', 'ع'], wazn: 'مِفْعَال' },
  { id: 'mitraqa', word: 'مِطْرَقَة', root: ['ط', 'ر', 'ق'], wazn: 'مِفْعَلَة' },
  { id: 'miknasa', word: 'مِكْنَسَة', root: ['ك', 'ن', 'س'], wazn: 'مِفْعَلَة' },
  { id: 'tabbakh', word: 'طَبَّاخ', root: ['ط', 'ب', 'خ'], wazn: 'فَعَّال' },
  { id: 'khayyat', word: 'خَيَّاط', root: ['خ', 'ي', 'ط'], wazn: 'فَعَّال' },
  { id: 'ghassala', word: 'غَسَّالَة', root: ['غ', 'س', 'ل'], wazn: 'فَعَّالَة' },
]

function buildQuestion(item: MizanItem): ChoiceQuestion {
  const wrongs = shuffled(WAZN_LIST.filter((w) => w !== item.wazn)).slice(0, 2)
  return choiceQ(
    `s2-mizan-${item.id}`,
    `زِنِي الكلمة «**${item.word}**» بالميزان الصرفي. على أي وزن هي؟`,
    [
      item.wazn,
      `صح! الحروف الأصلية (${item.root.join(' - ')}) بتقابل (ف - ع - ل)، والحروف الزائدة بتضل مكانها، فالوزن «${item.wazn}».`,
    ],
    wrongs.map((w): [string, string] => [
      w,
      `«${w}» وزن كلمة مثل «${WAZN_EXAMPLE[w]}»، بس زوائد «${item.word}» وحركاتها مختلفة.`,
    ]),
  )
}

/** سؤال الميزان الصرفي (متجدد) */
export function makeMizanQuestion(): ChoiceQuestion {
  return buildQuestion(pickOne(MIZAN_ITEMS))
}

/** سؤال ثابت من البنك ككتلة درس */
export function mizanQuiz(id: string): Block {
  const item = MIZAN_ITEMS.find((i) => i.id === id)
  if (!item) throw new Error(`mizan item not found: ${id}`)
  return { type: 'quiz', question: buildQuestion(item) }
}