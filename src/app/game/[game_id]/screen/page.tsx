"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import useChannel from "@/hooks/use-channel";

const GameScreenPage = () => {
    const [game, setGame] = useState();
    const params = useParams<{ game_id: string }>();

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
                    <h1 className="mb-4 text-center text-display-sm font-semibold text-primary">Join game</h1>
                    <p>
                        Game ID: <b>{params.game_id}</b>
                    </p>
                </div>
            </div>
        </>
    );
};

export default GameScreenPage;
