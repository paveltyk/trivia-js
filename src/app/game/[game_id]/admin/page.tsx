"use client";

// UI inspiration https://www.untitledui.com/react/iframe/settings-pages-02/settings-02
import { useEffect, useState } from "react";
import { ArrowDown, Check, DotsHorizontal, Plus, XClose } from "@untitledui/icons";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/app/game/[game_id]/admin/card";
import { Section, SectionHeader } from "@/app/game/[game_id]/admin/section";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";
import { QRCode } from "@/components/shared-assets/qr-code";
import useChannel from "@/hooks/use-channel";
import type { GameType } from "@/hooks/use-channel";
import { cx } from "@/utils/cx";
import { LeaderboardCard, LeaderboardCardEmpty } from "./leaderboard-card";
import TeamsCard from "./teams-card";

const QrCodeCard = ({ url }) => {
    return (
        <Card>
            <QRCode
                value={url}
                size="2xl"
                className="m-auto mb-4 cursor-zoom-in overflow-hidden rounded-lg bg-primary ring-primary duration-300 ease-out hover:scale-175 hover:ring"
            />
            <a href={url} target="blank" className="block w-full rounded-lg bg-tertiary px-6 py-4 text-center text-brand-700">
                {url}
            </a>
        </Card>
    );
};

const ActiveIndicator = ({ isActive }) => {
    const styles = {
        true: { ping: "animate-ping bg-brand-400", static: "bg-brand-500" },
        false: { ping: "hidden", static: "bg-tertiary" },
    };
    return (
        <span className="relative flex size-2">
            <span className={cx("absolute inline-flex h-full w-full rounded-full", styles[isActive].ping)}></span>
            <span className={cx("relative inline-flex size-2 rounded-full", styles[isActive].static)}></span>
        </span>
    );
};

const TeamGuessBadge = ({ team, guess }) => {
    const badgeColors = {
        true: "success",
        false: "error",
    };

    const badgeIcons = {
        true: Check,
        false: XClose,
    };

    const color = badgeColors[guess?.hit] || "gray";
    const icon = badgeIcons[guess?.hit];

    return (
        <BadgeWithIcon size="lg" type="color" color={color} iconLeading={guess?.["answer"] ? icon : DotsHorizontal} className="font-normal">
            {team}
            {guess?.["answer"] && <span className="font-semibold"> - {guess?.["answer"]}</span>}
        </BadgeWithIcon>
    );
};

const TeamGuesses = ({ teamGuesses, teams, item }) => {
    return (
        <>
            {teams.map((team) => {
                return <TeamGuessBadge key={team} team={team} guess={teamGuesses[team]?.[item.id]} />;
            })}
        </>
    );
};
const QuizCard = ({ game, onNext }) => {
    const items = game.questions;
    const allTeamsAnswered = Object.entries(game.teamGuesses)
        .map(([team, value]: [any, any]) => !!value[game.currentQuestion?.id])
        .every(Boolean);

    return (
        <Card>
            <div className="my-4 flex w-full flex-col">
                <div className="border-b border-primary p-4 pt-0 pb-3 text-left font-medium text-secondary">Questions and Answers</div>
                <div>
                    {items.map((item) => {
                        const isCurrentQuestion = item.id === game.currentQuestion?.id;

                        return (
                            <div
                                className={cx(
                                    "relative border-secondary px-4 py-6 text-secondary not-last:border-b last:pb-0",
                                    !game.currentQuestion || isCurrentQuestion ? "" : "opacity-50",
                                )}
                                key={item.id}
                            >
                                <div className="absolute bottom-[38px] -left-1">{isCurrentQuestion && <ActiveIndicator isActive={isCurrentQuestion} />}</div>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <p>
                                            <b>Q:</b> {item.question}
                                        </p>
                                        <p className="text-tertiary">
                                            <b>A:</b> {item.answer}
                                        </p>
                                    </div>
                                    {game.teams.length > 0 && (
                                        <div className="flex flex-row flex-wrap gap-2">
                                            <TeamGuesses teamGuesses={game.teamGuesses} teams={game.teams} item={item} />
                                        </div>
                                    )}
                                    {isCurrentQuestion && (
                                        <Button iconTrailing={ArrowDown} onClick={onNext} color={allTeamsAnswered ? "primary" : "secondary"}>
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};

const SectionBigScreen = ({ url, className }: { url: string; className?: any }) => {
    return (
        <Section className={className}>
            <SectionHeader
                title="Setup big screen"
                text="Use this URL on a projector or large screen to display the current question, game progress and joining instructions."
            />
            <QrCodeCard url={url} />
        </Section>
    );
};

const SectionJoinGame = ({ url, className }: { url: string; className?: any }) => {
    return (
        <Section className={className}>
            <SectionHeader title="Invite teams" text="Share this URL with players so they can join and answer questions. It also appears on the big screen." />
            <QrCodeCard url={url} />
        </Section>
    );
};

const SectionStartGame = ({ game, className, onGameStart }: { game: any; className?: any; onGameStart: any }) => {
    return (
        <Section className={className}>
            <SectionHeader title="Start the game" text="Start the game when all teams join." />
            <TeamsCard game={game} onGameStart={onGameStart} />
        </Section>
    );
};

const SectionRunGame = ({ game, className, onNext }: { game: any; className?: any; onNext: any }) => {
    return (
        <Section className={className}>
            <SectionHeader title="Run the game" text="Run the game, move to the next question, and see who has answered correctly." />
            <QuizCard game={game} onNext={onNext} />
        </Section>
    );
};

const SectionLeaderboard = ({ game, className }: { game: any; className?: any }) => {
    return (
        <Section className={className}>
            <SectionHeader title="Scoreboard" text="See who’s leading the game." />
            {game?.leaderboard.length > 0 && <LeaderboardCard game={game} />}
            {game?.leaderboard.length === 0 && <LeaderboardCardEmpty />}
        </Section>
    );
};

const SectionGameOver = ({ className }: { className?: any }) => {
    const router = useRouter();
    const newGame = () => {
        router.push(`/game/new`);
    };

    return (
        <Section className={className}>
            <SectionHeader title="Game over" text="That’s the end of this game! Ready to create a new one and play again?" />
            <div className="border-t border-primary py-4">
                <Button iconLeading={Plus} onClick={newGame}>
                    New game
                </Button>
            </div>
        </Section>
    );
};

const GameAdminPage = () => {
    const params = useParams<{ game_id: string }>();
    const [origin, setOrigin] = useState("");
    const [game, setGame] = useState<GameType | undefined>();

    const { connected, channel } = useChannel({
        room: `game:${params.game_id}`,
        params: { admin: true },
        onGameUpdated(game: GameType) {
            setGame(game);
        },
    });

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const startGame = () => {
        channel.push("start_game");
    };

    const nextQuestion = () => {
        channel.push("next_question", {});
    };

    const screenUrl = `${origin}/game/${params.game_id}/screen`;
    const lobbyUrl = `${origin}/game/${params.game_id}/lobby`;
    const gameStarted = game?.state === "game_started";
    const gameOver = game?.state === "game_over";

    return (
        <main className="bg-secondary pt-8 pb-16 lg:pt-12 lg:pb-24">
            <div className="flex flex-col gap-16">
                <SectionBigScreen url={screenUrl} />
                <SectionJoinGame url={lobbyUrl} />
                <SectionStartGame game={game} onGameStart={startGame} />
                {(gameStarted || gameOver) && <SectionRunGame game={game} onNext={nextQuestion} />}
                {gameOver && <SectionLeaderboard game={game} />}
                {gameOver && <SectionGameOver />}
            </div>
        </main>
    );
};

export default GameAdminPage;
