"use client";

import { useEffect, useState } from "react";
import { Check, CheckVerified02, XClose } from "@untitledui/icons";
import { Card } from "@/app/game/[game_id]/admin/card";
import LeaderboardCard from "@/app/game/[game_id]/admin/leaderboard-card";
import { QuestionBullet } from "@/app/game/[game_id]/question-screen";
import { PointsIcon, styles } from "@/app/game/[game_id]/screen/game-summary-screen";
import { GameSummaryInitializedCard } from "@/app/game/[game_id]/screen/game-summary-screen";
import { getQuestionIdx } from "@/my-components/utils";
import { cx } from "@/utils/cx";

export const GameSummaryInProgressCard = ({ game }) => {
    const [revealTeams, setRevealTeams] = useState(false);
    const [revealAnswers, setRevealAnswers] = useState(false);

    const question = game.summary.currentQuestion;

    const questionIdx = getQuestionIdx(game.questions, question);
    const teams = game.teams;

    const teamGuesses = teams.map((team) => {
        const guesses = game.teamGuesses[team] || {};
        const teamGuess = guesses[question.id] || {};
        return { team: team, guess: teamGuess };
    });

    const resetRevealTeams = () => {
        setTimeout(() => {
            setRevealTeams(true);
            resetRevealAnswers();
        }, 4000);
    };

    const resetRevealAnswers = () => {
        setTimeout(() => {
            setRevealAnswers(true);
        }, 5000);
    };

    useEffect(() => {
        setRevealTeams(false);
        setRevealAnswers(false);
        resetRevealTeams();
    }, [game.summary.currentQuestion?.id]);

    return (
        <Card className="overflow-hidden">
            <div className="flex flex-1 flex-col items-start justify-center overflow-visible px-2 py-2">
                <QuestionBullet number={questionIdx + 1} className="z-1 mb-3" />
                <h1 className="z-1 mb-2 text-lg font-semibold text-primary">{question.question}</h1>
                <h2
                    className={cx(
                        "z-1 flex items-center gap-1 text-lg font-semibold text-success-600",
                        styles.transition,
                        revealAnswers ? styles.visible : styles.hidden,
                    )}
                >
                    <CheckVerified02 className="size-4" />
                    {question.answer}
                </h2>
                <div className="w-full">
                    {teamGuesses.map(({ team, guess }, rowIdx) => (
                        <TeamRestulRow key={team} styles={styles} revealTeams={revealTeams} revealAnswers={revealAnswers} team={team} guess={guess} />
                    ))}
                </div>
            </div>
        </Card>
    );
};

const TeamRestulRow = ({ styles, revealTeams, revealAnswers, team, guess }) => {
    return (
        <div className="flex justify-between border-secondary py-6 text-md not-last:border-b" key={team}>
            <div className="relative">
                <div>{team}</div>
                <div
                    className={cx(
                        "absolute -mt-1 flex flex-row items-center gap-0 font-semibold",
                        guess.points > 0 ? "text-success-600" : "text-tertiary",
                        styles.transition,
                        revealAnswers ? styles.visible : styles.hidden,
                    )}
                >
                    <PointsIcon className="size-3 stroke-4" points={guess.points} />
                    {guess.points || "0"}
                </div>
            </div>
            <div className={revealAnswers ? "flex items-center" : ""}>
                <div className={cx("flex items-center gap-1 font-semibold", revealAnswers ? (guess.hit ? "text-success-600" : "text-error-600") : "")}>
                    <span className={cx(styles.transition, revealAnswers ? styles.visible : styles.hidden)}>
                        {guess.hit ? <Check className="size-4" /> : <XClose className="size-4" />}
                    </span>
                    <span>{guess.answer || "???"}</span>
                </div>
            </div>
        </div>
    );
};

export const GameoverScreen = ({ game }) => {
    const showSummary = ["initialized", "in_progress"].includes(game?.summary.state);

    return (
        <>
            {game?.summary.state === "initialized" && <GameSummaryInitializedCard size="sm" />}
            {game?.summary.state === "in_progress" && <GameSummaryInProgressCard game={game} />}
            {game?.summary.state === "complete" && <LeaderboardCard game={game} />}
        </>
    );
};
