import { useSyncExternalStore } from 'react'
import { findExam, findLesson } from './content'
import { ExamView } from './components/ExamView'
import { Home } from './components/Home'
import { LessonRunner } from './components/LessonRunner'
import { SpeedPage } from './components/SpeedView'


function subscribeHash(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}
const getHash = () => window.location.hash
const goHome = () => {
  window.location.hash = '#/'
}

export default function App() {
  const hash = useSyncExternalStore(subscribeHash, getHash)
  const lessonMatch = /^#\/lesson\/(.+)$/.exec(hash)
  const lesson = lessonMatch ? findLesson(decodeURIComponent(lessonMatch[1])) : undefined
  const examMatch = /^#\/exam\/(.+)$/.exec(hash)
  const exam = examMatch ? findExam(decodeURIComponent(examMatch[1])) : undefined
  const speedMatch = /^#\/speed\/(.+)$/.exec(hash)

  if (lesson) return <LessonRunner key={lesson.id} lesson={lesson} onExit={goHome} />
  if (exam) return <ExamView key={exam.id} exam={exam} onExit={goHome} />
  if (speedMatch) return <SpeedPage id={decodeURIComponent(speedMatch[1])} />
  return <Home />
}