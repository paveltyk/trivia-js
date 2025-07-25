"use client";

import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import useChannel from "@/hooks/use-channel";

export const QuestionScreen = ({ channel, game }) => {
    const [currentQuestion, setCurrentQuestion] = useState();
    const [currentAnswer, setCurrentAnswer] = useState();

    const submitAnswer = () => {
        channel.push("guess", { answer: currentAnswer });
    };

    const nextQuestion = () => {
        channel.push("next_question", {});
    };

    return (
        <>
            <h1 className="mb-4 text-center text-display-sm font-semibold text-primary">{game.currentQuestion}</h1>

            <Input placeholder="Type your answer" onChange={setCurrentAnswer} className="mb-4" />
            <Button onClick={submitAnswer} className="mb-4">
                Submit
            </Button>
            <Button onClick={nextQuestion}>Next question</Button>
        </>
    );
};
