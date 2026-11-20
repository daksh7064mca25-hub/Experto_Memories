"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, Trophy, RotateCcw, HelpCircle, Sparkles } from "lucide-react";
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
        colors: ["#f59e0b", "#ec4899", "#a855f7", "#10b981"],
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
    <section id="anniv-sec-quiz" className="py-16 px-4 max-w-xl mx-auto">
      <div className={`${themeConfig.cardBgClass} rounded-3xl p-6 sm:p-8 shadow-xl border relative overflow-hidden select-none`}>
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-serif font-semibold bg-amber-100 dark:bg-purple-950 text-amber-800 dark:text-purple-300 mb-2 border border-amber-200/80 dark:border-purple-800">
            Couple Milestones Trivia 💡
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-purple-100">
            {config.headline || "How Well Do You Know Us?"}
          </h2>
          <p className="text-xs sm:text-sm opacity-80 mt-1 max-w-sm mx-auto font-sans leading-relaxed">
            {config.subtext || "A playful little quiz about our funniest, sweetest relationship memories!"}
          </p>
        </div>

        {!isQuizComplete && currentQ ? (
          <div>
            {/* Question Progress Tracker */}
            <div className="flex items-center justify-between text-xs font-serif text-stone-500 dark:text-purple-300 mb-3 border-b border-stone-200/50 pb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="font-mono font-bold text-amber-600 dark:text-purple-400">Score: {score}</span>
            </div>

            {/* Question Heading */}
            <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-purple-100 mb-5 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3 mb-5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswerIndex === idx;
                const isCorrect = idx === currentQ.correctAnswerIndex;

                let buttonStyle = "bg-white/80 dark:bg-stone-800/80 border-stone-200/80 dark:border-stone-700 hover:bg-white text-stone-900 dark:text-purple-100";

                if (isAnswered) {
                  if (isCorrect) {
                    buttonStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-semibold";
                  } else if (isSelected) {
                    buttonStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-900 dark:text-rose-200";
                  } else {
                    buttonStyle = "opacity-50 border-stone-200 bg-white/40 text-stone-500";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full min-h-[48px] p-4 rounded-2xl text-left text-xs sm:text-sm font-sans flex items-center justify-between transition-all border shadow-sm active:scale-98 ${buttonStyle}`}
                  >
                    <span className="leading-snug pr-2">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle size={18} className="text-rose-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Button */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-purple-950/40 border border-amber-200/80 dark:border-purple-800 animate-in fade-in duration-300 space-y-3">
                <p className="text-xs sm:text-sm text-stone-700 dark:text-purple-200 leading-relaxed font-sans">
                  {currentQ.explanation}
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className={`px-5 py-2.5 rounded-full font-serif font-bold text-xs transition-all shadow-md min-h-[44px] ${themeConfig.primaryButtonClass}`}
                  >
                    {currentQuestionIndex < questions.length - 1 ? "Next Memory →" : "See Final Score 🏆"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results View */
          <div className="text-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-purple-900/60 flex items-center justify-center text-amber-600 dark:text-purple-300 shadow-lg">
              <Trophy size={32} className="animate-bounce" />
            </div>

            <h3 className="font-serif font-bold text-2xl text-stone-900 dark:text-purple-100 mb-1">
              You Scored {score} of {questions.length}!
            </h3>

            <p className="font-sans text-xs sm:text-sm text-stone-700 dark:text-purple-200 max-w-sm mx-auto mb-6 leading-relaxed">
              {config.passingScoreMessage ||
                "You know our love story by heart! Here's to writing a million more memories together. 💖"}
            </p>

            <button
              type="button"
              onClick={restartQuiz}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-serif font-bold text-xs shadow-lg transition-transform active:scale-95 min-h-[44px] ${themeConfig.primaryButtonClass}`}
            >
              <RotateCcw size={14} />
              <span>Play Quiz Again</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

