"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import useChannel from "@/hooks/use-channel";

const GameAdminPage = () => {
    const [game, setGame] = useState();
    const params = useParams<{ game_id: string }>();

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

    return (
        <>
            <div className="m-auto flex h-dvh max-w-3xl flex-col">
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 md:px-8">
                    <h1 className="mb-4 text-center text-display-sm font-semibold text-primary">Admin</h1>
                    <p>Game state: {game?.state}</p>
                    <p>Teams: {game?.leaderboard.map(({ team }) => team).join(", ")}</p>
                    <p>Current question: {game?.currentQuestion}</p>
                    {game?.state === "initialized" && <Button onClick={startGame}>Start game</Button>}
                    {game?.state === "game_started" && <Button onClick={nextQuestion}>Next question</Button>}
                </div>
            </div>
        </>
    );
};

export default GameAdminPage;
