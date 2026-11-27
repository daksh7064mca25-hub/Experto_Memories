"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, Trophy, RotateCcw, HelpCircle, Sparkles, Heart } from "lucide-react";
import { AnniversaryQuizConfig, QuizQuestion, ThemeId } from "@/types/website";
import { getThemeConfig } from "@/config/anniversary-themes";

interface Props {
  config: AnniversaryQuizConfig;
  theme: ThemeId;
}

export function AnniversaryQuizSection({ config, theme }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const themeConfig = getThemeConfig(theme, "anniversary");
  const questions = config.questions || [];
  const currentQ: QuizQuestion | undefined = questions[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedAnswerIndex(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswerIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswered(false);
    } else {
      setIsQuizComplete(true);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#C46879", "#E8B4B8", "#6B2D38", "#FAF6F0"],
      });
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  if (!questions || questions.length === 0) return null;

  return (
    <section id="anniv-sec-quiz" className="py-14 sm:py-20 px-4 max-w-xl mx-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8B4B8]/80 shadow-[#6B2D38]/10 relative overflow-hidden select-none">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-[#FFF5F6] text-[#6B2D38] border border-[#E8B4B8]/70 shadow-sm mb-3">
            <HelpCircle size={13} className="text-[#C46879]" />
            <span>Relationship Trivia</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#3D262A]">
            {config.headline || "How Well Do You Know Us?"}
          </h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#6B2D38]/85 mt-1 max-w-sm mx-auto leading-relaxed">
            {config.subtext || "A playful little quiz about our funniest, sweetest relationship memories!"}
          </p>
        </div>

        {!isQuizComplete && currentQ ? (
          <div>
            {/* Question Progress Tracker */}
            <div className="flex items-center justify-between text-xs font-mono text-[#6B2D38]/80 mb-3 border-b border-[#E8B4B8]/40 pb-2">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="font-bold text-[#C46879]">Score: {score}</span>
            </div>

            {/* Question Heading */}
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#3D262A] mb-5 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3 mb-5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswerIndex === idx;
                const isCorrect = idx === currentQ.correctAnswerIndex;

                let buttonStyle = "bg-[#FAF6F0] border-[#E8B4B8]/60 hover:bg-white text-[#3D262A]";

                if (isAnswered) {
                  if (isCorrect) {
                    buttonStyle = "bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-2 ring-emerald-200";
                  } else if (isSelected) {
                    buttonStyle = "bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200";
                  } else {
                    buttonStyle = "bg-stone-50 border-stone-200 text-stone-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm transition-all duration-200 flex items-center justify-between gap-3 ${buttonStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle size={16} className="text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answering */}
            {isAnswered && (
              <div className="p-3.5 rounded-2xl bg-[#FFF5F6] border border-[#E8B4B8]/70 text-xs sm:text-sm text-[#3D262A] mb-5 animate-in fade-in duration-300">
                <span className="font-serif font-bold text-[#6B2D38] block mb-1">
                  {selectedAnswerIndex === currentQ.correctAnswerIndex ? "Spot on! 🎉" : "Not quite! 💡"}
                </span>
                <p className="font-sans text-[#3D262A]/90">{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNextQuestion}
                className="w-full py-3 rounded-full text-xs sm:text-sm font-serif font-semibold bg-gradient-to-r from-[#C46879] to-[#6B2D38] text-white shadow-lg shadow-[#C46879]/30 hover:scale-102 transition-all"
              >
                {currentQuestionIndex < questions.length - 1 ? "Next Memory" : "View Final Score"}
              </button>
            )}
          </div>
        ) : (
          /* Completion Screen */
          <div className="text-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFF5F6] border-2 border-[#E8B4B8] flex items-center justify-center text-[#C46879] shadow-lg">
              <Trophy size={32} />
            </div>

            <h3 className="font-serif font-bold text-2xl text-[#3D262A] mb-1">
              Quiz Completed! 🥂
            </h3>

            <p className="font-mono text-sm text-[#C46879] font-bold mb-3">
              You scored {score} out of {questions.length}
            </p>

            <p className="font-serif italic text-xs sm:text-sm text-[#6B2D38]/85 max-w-xs mx-auto mb-6 leading-relaxed">
              {config.passingScoreMessage ||
                "No matter the score, every single memory with you is already etched forever in my heart."}
            </p>

            <button
              onClick={restartQuiz}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-serif font-semibold bg-[#FAF6F0] hover:bg-white text-[#6B2D38] border border-[#E8B4B8] shadow-sm transition-all"
            >
              <RotateCcw size={13} />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
