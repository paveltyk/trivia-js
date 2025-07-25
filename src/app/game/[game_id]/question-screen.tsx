"use client";

import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import useChannel from "@/hooks/use-channel";

export const QuestionScreen = ({ channel, game, team }) => {
    const [currentAnswer, setCurrentAnswer] = useState("");

    const handleChange = (value) => {
        setCurrentAnswer(value.toUpperCase());
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        channel.push("guess", { answer: currentAnswer.trim() });
        setCurrentAnswer("");
    };

    const teamGuesses = game.teamGuesses[team];
    const { answer } = (teamGuesses && teamGuesses[game.currentQuestion]) || {};
    const isAnswered = !!answer;

    return (
        <>
            <h1 className="mb-4 text-center text-display-sm font-semibold text-primary">{game.currentQuestion}</h1>

            {answer && <p>Your answer: {answer}</p>}

            {!answer && (
                <form onSubmit={handleSubmit} className="w-full">
                    <Input placeholder="Type your answer" onChange={handleChange} value={currentAnswer} className="mb-4" isDisabled={isAnswered} />
                    <Button type="submit" className="mb-4 w-full" isDisabled={isAnswered}>
                        Submit
                    </Button>
                </form>
            )}
        </>
    );
};
