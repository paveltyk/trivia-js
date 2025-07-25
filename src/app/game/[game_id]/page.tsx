"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import useChannel from "@/hooks/use-channel";
import type { GameType } from "@/hooks/use-channel";
import { GameoverScreen } from "./gameover-screen.tsx";
import { QuestionScreen } from "./question-screen.tsx";
import { StartScreen } from "./start-screen.tsx";

const GamePage = () => {
    const [game, setGame] = useState();
    const params = useParams<{ game_id: string }>();
    const searchParams = useSearchParams();
    const team = searchParams.get("team");

    const { connected, channel } = useChannel({
        room: `game:${params.game_id}`,
        params: { team: team || "Guest" },
        onGameUpdated(game: GameType) {
            setGame(game);
        },
    });

    return (
        <div className="m-auto flex h-dvh max-w-3xl flex-col">
            <div>
                <p>Team: {team}</p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 md:px-8">
                {game?.state === "initialized" && <StartScreen channel={channel} game={game} />}
                {game?.state === "game_started" && <QuestionScreen channel={channel} game={game} />}
                {game?.state === "game_over" && <GameoverScreen channel={channel} game={game} />}
            </div>
        </div>
    );
};

export default GamePage;
