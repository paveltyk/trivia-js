"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { QRCode } from "@/components/shared-assets/qr-code";
import useChannel from "@/hooks/use-channel";
import type { GameType } from "@/hooks/use-channel";

const JoinScreen = ({ game, gameId }) => {
    const [gameUrl, setGameUrl] = useState("");

    useEffect(() => {
        setGameUrl(`${window.location.origin}/game/${gameId}/lobby`);
    }, []);

    return (
        <>
            <h1 className="mb-4 text-center text-display-sm font-semibold text-primary">Join game</h1>
            <p className="mb-4">
                {" "}
                Game ID: <b>{gameId}</b>{" "}
            </p>
            <p>
                URL:{" "}
                <a href={gameUrl} target="blank" className="mb-4 text-brand-700">
                    {gameUrl}
                </a>
            </p>
            <QRCode value={gameUrl} size="2xl" />
        </>
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
            <div className="m-auto flex h-dvh max-w-3xl flex-col">
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 md:px-8">
                    {game?.state === "initialized" && <JoinScreen game={game} gameId={params.game_id} />}
                    {game?.state === "game_started" && <QuestionScreen game={game} />}
                    {game?.state === "game_over" && <LeaderboardScreen game={game} />}
                </div>
            </div>
        </>
    );
};

export default GameScreenPage;
