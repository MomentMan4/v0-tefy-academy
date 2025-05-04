"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import questions from "@/data/questions"
import { Button } from "@/components/ui/button"
import ProgressBar from "@/components/ProgressBar"
import QuestionCard from "@/components/QuestionCard"

export default function QuestionsPage() {
  const router = useRouter()
  const totalQuestions = questions.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(totalQuestions).fill(0))

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Save responses to localStorage and navigate
      localStorage.setItem("assessment-answers", JSON.stringify(answers))
      router.push("/assessment/results")
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleAnswerChange = (score: number) => {
    const updatedAnswers = [...answers]
    updatedAnswers[currentIndex] = score
    setAnswers(updatedAnswers)
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <ProgressBar current={currentIndex + 1} total={totalQuestions} />
      <QuestionCard
        question={currentQuestion.question}
        tooltip={currentQuestion.tooltip}
        options={currentQuestion.options}
        selected={answers[currentIndex]}
        onSelect={handleAnswerChange}
      />
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={answers[currentIndex] === 0}>
          {currentIndex === totalQuestions - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )
}
