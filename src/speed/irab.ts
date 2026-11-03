import type { ChoiceQuestion } from '../types'
import type { SpeedMaker } from '../lib/speed'
import { pick, shuffled } from '../lib/random'
import { CASES, CASE_LABEL, FORM_LABEL, SIGN_LABEL, SIGN_TABLE, SIGNS, makeIrabQuestion } from '../content/banks/irab'
import type { Case, NounForm } from '../content/banks/irab'
import { makeNawasikhMixQuestion } from '../content/banks/nawasikh'
import {
  makeJazmSignQuestion,
  makeKhamsaQuestion,
  makeMoodQuestion,
  makeNasbParticleQuestion,
  makeNasbSignQuestion,
  makeRafSignQuestion,
} from '../content/s2/banks/mudari'

const FORMS = Object.keys(SIGN_TABLE) as NounForm[]

/** «ما علامة إعراب المثنى في حالة النصب؟» — ١٨ احتمالاً (٦ أنواع × ٣ حالات) */
function makeFormSignQuestion(): ChoiceQuestion {
  const form = pick(FORMS)
  const c = pick(CASES)
  const right = SIGN_TABLE[form][c]
  const wrong = shuffled(SIGNS.filter((s) => SIGN_LABEL[s] !== SIGN_LABEL[right])).slice(0, 3)
  const name = `${CASE_LABEL[c]} لـ«${FORM_LABEL[form]}»`
  return {
    id: `speed-sign-${form}-${c}`,
    kind: 'choice',
    prompt: `ما علامة إعراب «${FORM_LABEL[form]}» في حالة **${CASE_LABEL[c]}**؟`,
    choices: [
      { text: SIGN_LABEL[right], correct: true, why: `صح! علامة ${name} هي ${SIGN_LABEL[right]}.` },
      ...wrong.map((s) => ({
        text: SIGN_LABEL[s],
        correct: false,
        why: `هذه ليست علامة ${name}. العلامة الصحيحة: ${SIGN_LABEL[right]}.`,
      })),
    ],
  }
}

/** أزواج (نوع، حالة) التي تتفرد علامتها داخل صفّ النوع، فيدل عليها الجواب بلا لبس */
const UNIQUE_PAIRS: [NounForm, Case][] = FORMS.flatMap((f) =>
  CASES.filter((c) => CASES.filter((o) => SIGN_TABLE[f][o] === SIGN_TABLE[f][c]).length === 1).map(
    (c): [NounForm, Case] => [f, c],
  ),
)

/** «جاء المثنى بالألف، فما حالته؟» */
function makeFormCaseQuestion(): ChoiceQuestion {
  const [form, c] = pick(UNIQUE_PAIRS)
  const sign = SIGN_TABLE[form][c]
  return {
    id: `speed-case-${form}-${c}`,
    kind: 'choice',
    prompt: `«${FORM_LABEL[form]}» علامة إعرابه ${SIGN_LABEL[sign]}. ما حالته؟`,
    choices: CASES.map((o) => ({
      text: CASE_LABEL[o],
      correct: o === c,
      why:
        o === c
          ? `صح! ${SIGN_LABEL[sign]} علامة ${CASE_LABEL[c]} لـ«${FORM_LABEL[form]}».`
          : `لا. ${SIGN_LABEL[sign]} في «${FORM_LABEL[form]}» علامة ${CASE_LABEL[c]}، لا ${CASE_LABEL[o]}.`,
    })),
  }
}

export const irabMakers: SpeedMaker[] = [
  makeFormSignQuestion,
  makeFormCaseQuestion,
  makeIrabQuestion,
  makeNawasikhMixQuestion,
  makeRafSignQuestion,
  makeNasbSignQuestion,
  makeJazmSignQuestion,
  makeMoodQuestion,
  makeNasbParticleQuestion,
  makeKhamsaQuestion,
]