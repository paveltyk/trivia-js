import { useEffect, useState } from "react";
import { ArrowRight, Check, CheckVerified02, Trophy01, XClose } from "@untitledui/icons";
import { Card } from "@/app/game/[game_id]/admin/card";
import { TeamsCard } from "@/app/game/[game_id]/admin/teams-card";
import { QuestionBullet } from "@/app/game/[game_id]/question-screen";
import { PointsIcon, styles } from "@/app/game/[game_id]/screen/game-summary-screen";
import { Button } from "@/components/base/buttons/button";
import { getQuestionIdx } from "@/my-components/utils";
import { cx } from "@/utils/cx";

export const GameSummaryInitialized = ({ channel }) => {
    const handleNextSummary = () => {
        channel.push("next_summary");
    };

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-center overflow-visible px-8 py-8">
                <TeamsCard.Content size="lg">
                    <TeamsCard.Header pattern="circle" className="relative">
                        <TeamsCard.FeaturedIcon color="brand" theme="light" icon={Trophy01} className="" />
                        <TeamsCard.FeaturedIcon
                            color="brand"
                            theme="light"
                            icon={Trophy01}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping opacity-25 duration-1500"
                        />
                    </TeamsCard.Header>

                    <TeamsCard.Body>
                        <TeamsCard.Title className="text-display-xs">Reveal the results</TeamsCard.Title>
                        <TeamsCard.Description className="text-md">All eyes are on you...</TeamsCard.Description>
                    </TeamsCard.Body>

                    <TeamsCard.Footer className="flex-col text-center">
                        <div>
                            <Button onClick={handleNextSummary} className="" size="md">
                                Results time
                            </Button>
                        </div>
                        <p className="max-w-sm text-xs text-tertiary">
                            Kick off the reveal and watch questions and answers pop up one by one on the big screen and team screens!
                        </p>
                    </TeamsCard.Footer>
                </TeamsCard.Content>
            </div>
        </Card>
    );
};

export const GameSummaryInProgress = ({ game, channel }) => {
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

    const handleNextSummary = () => {
        channel.push("next_summary");
    };

    return (
        <Card className="overflow-hidden">
            <div className="flex flex-1 flex-col items-start justify-center overflow-visible px-8 py-8">
                <QuestionBullet number={questionIdx + 1} className="z-1 mb-3" />
                <h1 className="z-1 mb-2 text-display-xs font-semibold text-primary">{question.question}</h1>
                <h2
                    className={cx(
                        "z-1 flex items-center gap-2 text-display-xs font-semibold text-success-600",
                        styles.transition,
                        revealAnswers ? styles.visible : styles.hidden,
                    )}
                >
                    <CheckVerified02 />
                    {question.answer}
                </h2>
                <div className="w-full">
                    {teamGuesses.map(({ team, guess }, rowIdx) => (
                        <TeamRestulRow key={team} styles={styles} revealTeams={revealTeams} revealAnswers={revealAnswers} team={team} guess={guess} />
                    ))}
                </div>
                <div className="self-center">
                    <Button onClick={handleNextSummary} size="md" iconTrailing={ArrowRight} isDisabled={!revealAnswers}>
                        Reveal next
                    </Button>
                </div>
            </div>
        </Card>
    );
};

const TeamRestulRow = ({ styles, revealTeams, revealAnswers, team, guess }) => {
    return (
        <div className="flex justify-between border-secondary py-10 text-xl not-last:border-b" key={team}>
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
                    <PointsIcon className="size-4 stroke-4" points={guess.points} />
                    {guess.points || "0"}
                </div>
            </div>
            <div className={revealAnswers ? "flex items-center" : ""}>
                <div className={cx("flex items-center gap-1 font-semibold", revealAnswers ? (guess.hit ? "text-success-600" : "text-error-600") : "")}>
                    <span className={cx(styles.transition, revealAnswers ? styles.visible : styles.hidden)}>{guess.hit ? <Check /> : <XClose />}</span>
                    <span>{guess.answer || "???"}</span>
                </div>
            </div>
        </div>
    );
};

export const GameSummaryCard = ({ game, channel }) => {
    return (
        <>
            {game.summary.state === "initialized" && <GameSummaryInitialized channel={channel} />}
            {game.summary.state === "in_progress" && <GameSummaryInProgress game={game} channel={channel} />}
        </>
    );
};

export default GameSummaryCard;
