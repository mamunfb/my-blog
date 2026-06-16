import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  title?: string;
}

export default function InteractiveQuiz({
  questions,
  title = "Quiz",
}: InteractiveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleSelectAnswer = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <Card className="p-6 bg-accent/5 border-accent/20">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">Quiz Completed!</h3>
          <div className="text-4xl font-bold text-accent">
            {score}/{questions.length}
          </div>
          <p className="text-foreground/70">
            You scored {Math.round((score / questions.length) * 100)}%
          </p>
          <Button onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <div className="text-sm text-foreground/70">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-accent h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{question.question}</h4>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResult}
                className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                  selectedAnswer === index
                    ? isCorrect && showResult
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : !isCorrect && showResult
                        ? "border-red-500 bg-red-50 dark:bg-red-950"
                        : "border-accent bg-accent/10"
                    : showResult && index === question.correctAnswer
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-border hover:border-accent/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && (
                    <>
                      {index === question.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {selectedAnswer === index && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {question.explanation && showResult && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-1">Explanation:</p>
            <p className="text-foreground/70">{question.explanation}</p>
          </div>
        )}

        <div className="flex gap-2">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="flex-1"
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              {currentQuestion < questions.length - 1
                ? "Next Question"
                : "See Results"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
