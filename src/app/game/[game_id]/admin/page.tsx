"use client";

import { useEffect, useState } from "react";
import { ArrowRight, DotsHorizontal } from "@untitledui/icons";
import { Check, HelpCircle, XClose } from "@untitledui/icons";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import type { SortDescriptor } from "react-aria-components";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeGroup } from "@/components/base/badges/badge-groups";
import type { BadgeTypes } from "@/components/base/badges/badge-types";
import { Badge, type BadgeColor, BadgeWithDot } from "@/components/base/badges/badges";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { QRCode } from "@/components/shared-assets/qr-code";
import useChannel from "@/hooks/use-channel";
import type { GameType } from "@/hooks/use-channel";

// TODO: Refactor the screen for better UX;
// 1. Setup big screen with this URL or share this link with players so they can join the game. CTA: Start game
// 2. Track game progress. CTA: Next
// 3. Leader board. Game over. CTA: New game

const badgeColors = {
    true: "success",
    false: "error",
};
const badgeIcons = {
    true: Check,
    false: XClose,
};
const TeamGuessBadge = ({ team, guess }) => {
    const color = badgeColors[guess?.hit] || "gray";
    const icon = badgeIcons[guess?.hit];
    return (
        <BadgeGroup addonText={team} color={color} iconTrailing={guess?.["answer"] ? icon : DotsHorizontal} theme="modern" align="leading" size="lg">
            {guess?.["answer"]}
        </BadgeGroup>
    );
};

const ActiveIndicator = () => {
    return (
        <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-brand-500"></span>
        </span>
    );
};
const QuestionsTable = ({ game, onNextQuestion, onGameStart, onNewGame }) => {
    const currentQuestion = game.currentQuestion;
    const questions = game.questions;
    const teamGuesses = game.teamGuesses;
    const teams = Object.keys(teamGuesses);
    const allTeamsAnswered = Object.entries(teamGuesses)
        .map(([team, value]: [any, any]) => !!value[currentQuestion?.id])
        .every(Boolean);

    const TeamGuesses = ({ teamGuesses, teams, item }) => {
        return (
            <>
                {teams.map((team) => {
                    return (
                        <div className="mb-2" key={team}>
                            <TeamGuessBadge team={team} guess={teamGuesses[team]?.[item.id]} />
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <TableCard.Root>
            <TableCard.Header
                title="Questions and answers"
                badge={`${teams.length} team${teams.length === 1 ? "" : "s"}`}
                contentTrailing={
                    <div className="flex items-center gap-3">
                        {game.state === "initialized" && (
                            <Button size="md" iconTrailing={ArrowRight} color={teams.length > 0 ? "primary" : "secondary"} onClick={onGameStart}>
                                Start game
                            </Button>
                        )}
                        {game.state === "game_started" && (
                            <Button size="md" iconTrailing={ArrowRight} color={allTeamsAnswered ? "primary" : "secondary"} onClick={onNextQuestion}>
                                Next
                            </Button>
                        )}
                        {game.state === "game_over" && (
                            <>
                                <Button size="md" color="primary" onClick={onNewGame}>
                                    New game
                                </Button>
                                <Button size="md" color="secondary" isDisabled>
                                    Game over
                                </Button>
                            </>
                        )}
                    </div>
                }
            />
            <Table aria-label="Questions and answers">
                <Table.Header>
                    <Table.Head id="Active" isRowHeader className="w-3 pr-1" />
                    <Table.Head id="Question" label="Question" isRowHeader />
                    <Table.Head id="Team Answer" label="Team Answer" isRowHeader />
                </Table.Header>

                <Table.Body items={questions}>
                    {(item: { id: string; question: string; answer: string }) => {
                        const isActiveItem = item.id === game.currentQuestion?.id;
                        return (
                            <Table.Row id={item.id} className={!game.currentQuestion || isActiveItem ? "" : "opacity-50"}>
                                <Table.Cell className="w-3 pr-1">
                                    <div className="w-3">{isActiveItem && <ActiveIndicator />}</div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div>
                                        <p className="text-primary">Q: {item.question}</p>
                                        <p className="text-tertiary">A: {item.answer}</p>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <TeamGuesses teamGuesses={teamGuesses} teams={teams} item={item} />
                                </Table.Cell>
                            </Table.Row>
                        );
                    }}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};

const Leaderboard = ({ items }) => {
    return (
        <TableCard.Root>
            <TableCard.Header title="Leaderboard" badge={`${items.length} team${items.length === 1 ? "" : "s"}`} />
            <Table aria-label="Questions and answers">
                <Table.Header>
                    <Table.Head id="Team" label="Team" isRowHeader />
                    <Table.Head id="Score" label="Score" isRowHeader />
                </Table.Header>

                <Table.Body items={items}>
                    {(item: { team: string; score: number }) => (
                        <Table.Row id={item.team}>
                            <Table.Cell>{item.team}</Table.Cell>
                            <Table.Cell>{item.score}</Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};

const GameAdminPage = () => {
    const router = useRouter();

    const [game, setGame] = useState<GameType | undefined>();
    const [origin, setOrigin] = useState("");
    const params = useParams<{ game_id: string }>();

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const { connected, channel } = useChannel({
        room: `game:${params.game_id}`,
        params: { admin: true },
        onGameUpdated(game: GameType) {
            setGame(game);
        },
    });

    const startGame = () => {
        channel.push("start_game");
    };

    const nextQuestion = () => {
        channel.push("next_question", {});
    };
    const newGame = () => {
        router.push(`/game/new`);
    };

    const lobbyUrl = `${origin}/game/${params.game_id}/lobby`;
    const screenUrl = `${origin}/game/${params.game_id}/screen`;

    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="mb-8 border-b-1 border-secondary pb-2 text-display-sm font-semibold text-primary">Admin panel for game "{params.game_id}"</h1>

                <div className="mb-8">{game && <QuestionsTable game={game} onNextQuestion={nextQuestion} onGameStart={startGame} onNewGame={newGame} />}</div>
                <div className="mb-8">{game && <Leaderboard items={game?.leaderboard} />}</div>

                <div className="flex flex-row gap-4">
                    <div className="max-w-md overflow-hidden rounded-lg border border-secondary">
                        <div className="border-b-1 border-primary p-4 text-lg font-semibold">Join URL</div>
                        <div className="p-4">
                            <QRCode value={lobbyUrl} size="2xl" className="m-auto mb-4 w-min" />
                            <a href={lobbyUrl} target="blank" className="text-brand-700">
                                {lobbyUrl}
                            </a>
                        </div>
                        <div className="border-t-1 border-primary bg-secondary p-4 text-secondary">
                            Share this URL with the players so that they can join the game. That is where players will answer the questions.
                        </div>
                    </div>
                    <div className="max-w-md overflow-hidden rounded-lg border border-secondary">
                        <div className="border-b-1 border-primary p-4 text-lg font-semibold">Screen URL</div>
                        <div className="p-4">
                            <QRCode value={screenUrl} size="2xl" className="m-auto mb-4 w-min" />
                            <a href={screenUrl} target="blank" className="text-brand-700">
                                {screenUrl}
                            </a>
                        </div>
                        <div className="border-t-1 border-primary bg-secondary p-4 text-secondary">
                            Use this URL for your big screen or projector. That is where players will see the current question and game progress.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameAdminPage;
