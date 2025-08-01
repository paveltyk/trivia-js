"use client";

// UI inspiration https://www.untitledui.com/react/iframe/settings-pages-02/settings-02
import { useEffect, useState } from "react";
import { ArrowDown, Check, DotsHorizontal, GamingPad01, Plus, Users01, XClose } from "@untitledui/icons";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/app/game/[game_id]/admin/card";
import { Section, SectionHeader } from "@/app/game/[game_id]/admin/section";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Avatar } from "@/components/base/avatar/avatar";
import { getInitials } from "@/components/base/avatar/utils";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";
import { QRCode } from "@/components/shared-assets/qr-code";
import useChannel from "@/hooks/use-channel";
import type { GameType } from "@/hooks/use-channel";
import { cx } from "@/utils/cx";
import LeaderboardCard from "./leaderboard-card";

const plural = (count, singular, plural) => {
    return count === 1 ? singular : plural;
};

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

const TeamsCard = ({ teams, onGameStart, gameStarted, gameOver }) => {
    const teamsCount = teams?.length || 0;
    const isEmpty = teamsCount === 0;

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-center overflow-visible px-8 py-10">
                <EmptyState size="sm">
                    <EmptyState.Header pattern="circle">
                        <EmptyState.FeaturedIcon color="gray" theme="modern-neue" icon={Users01} />
                    </EmptyState.Header>

                    <EmptyState.Content>
                        {isEmpty && <EmptyState.Title>No teams have joined the game yet</EmptyState.Title>}
                        {!isEmpty && (
                            <EmptyState.Title>
                                {teamsCount} {plural(teamsCount, "team", "teams")} {plural(teamsCount, "has", "have")} joined the game
                            </EmptyState.Title>
                        )}

                        {!isEmpty && (
                            <div className="my-4 flex gap-2">
                                <div className="flex -space-x-2">
                                    {teams.map((team) => (
                                        <TeamAvatar team={team} key={team} className="ring-[1.5px] ring-bg-primary" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {isEmpty && <EmptyState.Description>You can start now and let them join later.</EmptyState.Description>}
                        {!isEmpty && (
                            <EmptyState.Description>
                                Go ahead and start the game.
                                <br />
                                More teams can join later.
                            </EmptyState.Description>
                        )}
                    </EmptyState.Content>

                    <EmptyState.Footer className="flex-col text-center">
                        <div className="pt-4">
                            {!(gameStarted || gameOver) && (
                                <Button size="md" iconLeading={GamingPad01} color={isEmpty ? "secondary" : "primary"} onClick={onGameStart}>
                                    Start game
                                </Button>
                            )}
                            {gameStarted && (
                                <Button size="md" iconLeading={GamingPad01} color={"secondary"} isDisabled>
                                    Game started
                                </Button>
                            )}
                            {gameOver && (
                                <Button size="md" iconLeading={XClose} color={"secondary"} isDisabled>
                                    Game over
                                </Button>
                            )}
                        </div>
                        <p className="max-w-sm text-xs text-tertiary">
                            Once you start the game, the big screen will show the first question, and all joined teams can answer on their devices.
                        </p>
                    </EmptyState.Footer>
                </EmptyState>
            </div>
        </Card>
    );
};

const getTeamColor = (team, colors) => {
    const simpleHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    };

    const getItemFromList = (str, list) => {
        const hash = simpleHash(str);
        const index = Math.abs(hash) % list.length;
        return list[index];
    };

    return getItemFromList(team, colors);
};

const TeamAvatar = ({ team, className }) => {
    const colors = [
        "bg-red-100",
        "bg-orange-100",
        "bg-amber-100",
        "bg-yellow-100",
        "bg-lime-100",
        "bg-green-100",
        "bg-emerald-100",
        "bg-teal-100",
        "bg-cyan-100",
        "bg-sky-100",
        "bg-blue-100",
        "bg-indigo-100",
        "bg-violet-100",
        "bg-purple-100",
        "bg-fuchsia-100",
        "bg-pink-100",
        "bg-rose-100",
        "bg-slate-100",
        "bg-zinc-100",
    ];
    const initials = getInitials(team);
    const color = getTeamColor(team, colors);

    return (
        <Tooltip title={team} arrow>
            <TooltipTrigger className="group relative flex cursor-pointer flex-col items-center gap-2 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-quaternary_hover focus:text-fg-quaternary_hover">
                <Avatar size="md" alt={team} initials={initials} className={cx("cursor-default", color, className)} />
            </TooltipTrigger>
        </Tooltip>
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

const LeaderboardCardEmpty = () => {
    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-center overflow-visible px-8 py-10">
                <EmptyState size="sm">
                    <EmptyState.Header pattern="circle">
                        <EmptyState.FeaturedIcon color="gray" theme="modern-neue" icon={Users01} />
                    </EmptyState.Header>

                    <EmptyState.Content className="mb-0">
                        <EmptyState.Title>Nothing on the leaderboard</EmptyState.Title>
                        <EmptyState.Description>No teams have joined the game.</EmptyState.Description>
                    </EmptyState.Content>
                </EmptyState>
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

const SectionStartGame = ({
    teams,
    className,
    onGameStart,
    gameStarted,
    gameOver,
}: {
    teams: any;
    className?: any;
    onGameStart: any;
    gameStarted: boolean;
    gameOver: boolean;
}) => {
    return (
        <Section className={className}>
            <SectionHeader title="Start the game" text="Start the game when all teams join." />
            <TeamsCard teams={teams} onGameStart={onGameStart} gameStarted={gameStarted} gameOver={gameOver} />
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
                <SectionStartGame teams={game?.teams} onGameStart={startGame} gameStarted={gameStarted} gameOver={gameOver} />
                {(gameStarted || gameOver) && <SectionRunGame game={game} onNext={nextQuestion} />}
                {gameOver && <SectionLeaderboard game={game} />}
                {gameOver && <SectionGameOver />}
            </div>
        </main>
    );
};

export default GameAdminPage;
