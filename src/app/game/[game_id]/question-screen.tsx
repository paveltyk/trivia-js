"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import useChannel from "@/hooks/use-channel";

export const QuestionScreen = ({ channel, game, team }) => {
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [isSubmitted, setSubmitted] = useState(false);

    const handleChange = (value) => {
        setCurrentAnswer(value.toUpperCase());
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        channel.push("guess", { answer: currentAnswer.trim() });
        setSubmitted(true);
    };

    useEffect(() => {
        const teamGuesses = game.teamGuesses[team];
        const { answer } = (teamGuesses && teamGuesses[game.currentQuestion]) || {};

        setCurrentAnswer(answer || "");
        setSubmitted(!!answer);
    }, [game.currentQuestion]);

    return (
        <>
            <h1 className="mb-8 text-display-xs font-medium text-primary">{game.currentQuestion}</h1>

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
