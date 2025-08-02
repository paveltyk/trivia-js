"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";
import useChannel from "@/hooks/use-channel";
import { cx } from "@/utils/cx";

export const QuestionBullet = ({ number, className }: { number: any; className?: any }) => {
    return (
        <div className={cx("relative size-7 text-display-xs font-medium text-tertiary", className)}>
            <BackgroundPattern
                size="md"
                pattern="circle"
                className="absolute top-1/2 left-1/2 -z-1 -translate-x-1/2 -translate-y-1/2 animate-ping opacity-80"
            />
            <BackgroundPattern size="md" pattern="circle" className="absolute top-1/2 left-1/2 -z-1 -translate-x-1/2 -translate-y-1/2" />
            <span>Q{number}</span>
        </div>
    );
};

export const QuestionScreen = ({ channel, game, team }) => {
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [isSubmitted, setSubmitted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const handleChange = (value) => {
        setCurrentAnswer(value.toUpperCase());
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        channel.push("guess", { answer: currentAnswer.trim() });
        setSubmitted(true);
    };

    useEffect(() => {
        const currentQuestion = game.currentQuestion;
        const teamGuesses = game.teamGuesses[team];
        const { answer } = (teamGuesses && teamGuesses[currentQuestion.id]) || {};
        const questionIdx = game.questions.findIndex((question) => question.id === currentQuestion.id);

        setCurrentAnswer(answer || "");
        setSubmitted(!!answer);
        setCurrentIndex(questionIdx);
    }, [game.currentQuestion.id]);

    return (
        <>
            <QuestionBullet number={currentIndex + 1} className="mb-9" />
            <h1 className="mb-8 text-display-xs font-medium text-primary">{game.currentQuestion.question}</h1>
            <form onSubmit={handleSubmit} className="w-full">
                <Input placeholder="Type your answer" onChange={handleChange} value={currentAnswer} className="mb-4" isDisabled={isSubmitted} size="md" />
                {!isSubmitted && (
                    <Button type="submit" className="w-full" size="lg">
                        Submit
                    </Button>
                )}
                {isSubmitted && (
                    <Button
                        type="button"
                        className="w-full"
                        size="lg"
                        color="secondary"
                        onClick={() => {
                            setSubmitted(false);
                        }}
                    >
                        Change
                    </Button>
                )}
            </form>
        </>
    );
};
