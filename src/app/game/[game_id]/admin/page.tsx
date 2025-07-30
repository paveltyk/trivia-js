"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import useChannel from "@/hooks/use-channel";
import type { GameType } from "@/hooks/use-channel";

const GameAdminPage = () => {
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

    const lobbyUrl = `${origin}/game/${params.game_id}/lobby`;
    const screenUrl = `${origin}/game/${params.game_id}/screen`;

    return (
        <>
            <div className="m-auto flex h-dvh max-w-3xl flex-col">
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 md:px-8">
                    <h1 className="mb-4 text-center text-display-sm font-semibold text-primary">Admin</h1>
                    <p>Game state: {game?.state}</p>
                    <p>Teams: {game?.leaderboard.map(({ team }) => team).join(", ")}</p>
                    <p>Current question: {game?.currentQuestion?.question}</p>
                    <p>
                        Join URL:{" "}
                        <a href={lobbyUrl} target="blank" className="text-brand-700">
                            {lobbyUrl}
                        </a>
                    </p>
                    <p className="mb-4">
                        Screen URL:{" "}
                        <a href={screenUrl} target="blank" className="text-brand-700">
                            {screenUrl}
                        </a>
                    </p>
                    {game?.state === "initialized" && <Button onClick={startGame}>Start game</Button>}
                    {game?.state === "game_started" && <Button onClick={nextQuestion}>Next question</Button>}
                </div>
            </div>
        </>
    );
};

export default GameAdminPage;
