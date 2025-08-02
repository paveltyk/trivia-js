"use client";

import { useEffect, useState } from "react";
import { Users01 } from "@untitledui/icons";
import { useParams } from "next/navigation";
import { Card } from "@/app/game/[game_id]/admin/card";
import { LeaderboardCard, LeaderboardCardEmpty } from "@/app/game/[game_id]/admin/leaderboard-card";
import { TeamAvatar, TeamsCard } from "@/app/game/[game_id]/admin/teams-card";
import { Button } from "@/components/base/buttons/button";
import { QRCode } from "@/components/shared-assets/qr-code";
import useChannel from "@/hooks/use-channel";
import type { GameType } from "@/hooks/use-channel";
import { plural } from "@/my-components/utils";

const JoinCard = ({ game }) => {
    const teams = game?.teams || [];
    const teamsCount = teams.length || 0;
    const isEmpty = teamsCount === 0;

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-center overflow-visible px-8 py-10">
                <TeamsCard.Content size="lg">
                    <TeamsCard.Header pattern="circle" className="relative">
                        <TeamsCard.FeaturedIcon color="gray" theme="light" icon={Users01} className="" />
                        <TeamsCard.FeaturedIcon
                            color="gray"
                            theme="light"
                            icon={Users01}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping opacity-25 duration-1500"
                        />
                    </TeamsCard.Header>

                    <TeamsCard.Body className="mb-0">
                        <TeamsCard.Title>Phone out, scan in — join the fun!</TeamsCard.Title>
                        {isEmpty && (
                            <>
                                <TeamsCard.Description>No teams have joined the game yet</TeamsCard.Description>
                            </>
                        )}
                        {!isEmpty && (
                            <>
                                <TeamsCard.Description>
                                    {teamsCount} {plural(teamsCount, "team", "teams")} {plural(teamsCount, "has", "have")} joined the game.
                                    {teamsCount > 1 && (
                                        <>
                                            {" "}
                                            <br />
                                            <span>The host will start the game shortly...</span>
                                        </>
                                    )}
                                </TeamsCard.Description>
                                <div className="mt-4 flex w-full flex-row flex-wrap content-center justify-center gap-x-6 gap-y-2">
                                    {teams.map((team) => (
                                        <div className="flex items-center gap-1 pb-2 last:border-b-0" key={team}>
                                            <TeamAvatar team={team} />
                                            <p className="font-semibold text-tertiary">{team}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </TeamsCard.Body>
                </TeamsCard.Content>
            </div>
        </Card>
    );
};

const JoinScreen = ({ game, gameId }) => {
    const [gameUrl, setGameUrl] = useState("");

    useEffect(() => {
        setGameUrl(`${window.location.origin}/game/${gameId}/lobby`);
    }, []);

    return (
        <div className="grid min-h-screen grid-cols-2 bg-brand-section">
            <div className="m-auto flex h-full flex-col">
                <div className="flex min-h-0 max-w-xl flex-1 flex-col justify-center gap-6 px-4 md:px-8">
                    <JoinCard game={game} />
                    <Card className="text-center font-semibold text-brand-700">{gameUrl}</Card>
                </div>
            </div>
            <div className="bg-white">
                <div className="m-auto flex h-dvh max-w-xl flex-col">
                    <div className="flex min-h-0 flex-1 flex-col justify-center px-4 md:px-8">
                        <QRCode value={gameUrl} size="3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuestionScreen = ({ game }) => {
    return (
        <>
            <h1 className="mb-4 text-center text-display-sm font-semibold text-primary">{game.currentQuestion.question}</h1>
        </>
    );
};

const LeaderboardScreen = ({ game }) => {
    return (
        <>
            <h1 className="mb-4 text-center text-display-sm text-primary">Score:</h1>
            <ol className="list-decimal">
                {game.leaderboard.map((row) => {
                    return (
                        <li key={row.team}>
                            <b>{row.team}</b> - {row.score}
                        </li>
                    );
                })}
            </ol>
        </>
    );
};

const GameScreenPage = () => {
    const params = useParams<{ game_id: string }>();
    const [game, setGame] = useState<GameType | undefined>();

    const { connected, channel } = useChannel({
        room: `game:${params.game_id}`,
        params: { screen: true },
        onGameUpdated(game: GameType) {
            setGame(game);
        },
    });

    return (
        <>
            {game?.state === "initialized" && <JoinScreen game={game} gameId={params.game_id} />}
            {game?.state === "game_started" && <QuestionScreen game={game} />}
            {game?.state === "game_over" && game?.leaderboard.length > 0 && <LeaderboardCard game={game} />}
            {game?.state === "game_over" && game?.leaderboard.length === 0 && <LeaderboardCardEmpty />}
        </>
    );
};

export default GameScreenPage;
