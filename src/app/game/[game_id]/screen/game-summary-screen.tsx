import { useEffect, useState } from "react";
import { Check, CheckVerified02, Minus, Plus, Trophy01, XClose } from "@untitledui/icons";
import { Card } from "@/app/game/[game_id]/admin/card";
import { TeamAvatar, TeamsCard } from "@/app/game/[game_id]/admin/teams-card";
import { QuestionBullet } from "@/app/game/[game_id]/question-screen";
import { getQuestionIdx } from "@/my-components/utils";
import { cx } from "@/utils/cx";

export const GameSummaryScreen = ({ game }) => {
    return (
        <>
            {game.summary.state === "initialized" && <GameSummaryInitialized />}
            {game.summary.state === "in_progress" && <GameSummaryInProgress game={game} />}
        </>
    );
};

export const styles = {
    transition: "transition-all",
    visible: "duration-500 opacity-100",
    hidden: "duration-0 opacity-0",
};

export const GameSummaryInProgress = ({ game }) => {
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
        <>
            <div className="bg-tertiary-section grid min-h-screen grid-cols-2">
                <div className="m-auto flex h-full flex-col">
                    <div className="flex min-h-0 max-w-xl flex-1 flex-col justify-center gap-6 px-4 md:px-8">
                        <QuestionBullet number={questionIdx + 1} className="mb-9" />
                        <h1 className="mb-4 text-display-md font-semibold text-primary">{question.question}</h1>
                        <h2
                            className={cx(
                                "flex items-center gap-2 text-display-md font-semibold text-success-600",
                                styles.transition,
                                revealAnswers ? styles.visible : styles.hidden,
                            )}
                        >
                            <CheckVerified02 />
                            {question.answer}
                        </h2>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-950">
                    <div className="m-auto flex h-dvh max-w-xl flex-col">
                        <div className="flex min-h-0 flex-1 flex-col justify-center px-4 md:px-8">
                            {teamGuesses.map(({ team, guess }, rowIdx) => (
                                <TeamRestulRow key={team} styles={styles} revealTeams={revealTeams} revealAnswers={revealAnswers} team={team} guess={guess} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const PointsIcon = ({ points, ...props }) => {
    if (points === 0) {
        return;
    } else if (points > 0) {
        return <Plus {...props} />;
    } else if (points < 0) {
        return <Minus {...props} />;
    }
};

const TeamRestulRow = ({ styles, revealTeams, revealAnswers, team, guess }) => {
    return (
        <div
            className={cx(
                "flex justify-between border-secondary py-10 text-xl not-last:border-b",
                styles.transition,
                revealTeams ? styles.visible : styles.hidden,
            )}
            key={team}
        >
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

export const GameSummaryInitializedCard = ({ size: cardSize }: { size?: "sm" | "lg" }) => {
    const size = cardSize || "lg";

    const styles = {
        title: size === "lg" ? "text-display-sm" : "text-display-xs",
        description: size === "lg" ? "text-lg" : "text-md",
        outerDiv: size === "lg" ? "px-8 py-20" : "px-2 py-10",
    };

    return (
        <Card className="overflow-hidden">
            <div className={cx("flex items-center justify-center overflow-visible", styles.outerDiv)}>
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

                    <TeamsCard.Body className="mb-0">
                        <TeamsCard.Title className={styles.title}>Hang tight</TeamsCard.Title>
                        <TeamsCard.Description className={styles.description}>The host is about to reveal the results.</TeamsCard.Description>
                    </TeamsCard.Body>
                </TeamsCard.Content>
            </div>
        </Card>
    );
};

const GameSummaryInitialized = () => {
    return (
        <div className="m-auto flex h-dvh w-3xl flex-col">
            <div className="flex min-h-0 flex-1 flex-col justify-center px-4 md:px-8">
                <GameSummaryInitializedCard />
            </div>
        </div>
    );
};

export default GameSummaryScreen;
