"use client";

import { useState } from "react";
import { Server05, Users01 } from "@untitledui/icons";
import { useParams, useSearchParams } from "next/navigation";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import useChannel from "@/hooks/use-channel";
import type { GameType } from "@/hooks/use-channel";
import { GameoverScreen } from "./gameover-screen.tsx";
import { QuestionScreen } from "./question-screen.tsx";
import { StartScreen } from "./start-screen.tsx";

const GamePage = () => {
    const [game, setGame] = useState<GameType | undefined>();
    const params = useParams<{ game_id: string }>();
    const searchParams = useSearchParams();
    const team = searchParams.get("team") || "Guest";

    const { connected, channel } = useChannel({
        room: `game:${params.game_id}`,
        params: { team: team },
        onGameUpdated(game: GameType) {
            setGame(game);
        },
    });

    return (
        <>
            <div className="m-auto flex h-dvh max-w-xl flex-col">
                <div className="flex min-h-0 flex-1 flex-col justify-center px-4 md:px-8">
                    {game?.state === "initialized" && <StartScreen channel={channel} game={game} />}
                    {game?.state === "game_started" && <QuestionScreen channel={channel} game={game} team={team} />}
                    {game?.state === "game_over" && <GameoverScreen channel={channel} game={game} />}
                </div>
            </div>
            <div className="absolute right-0 bottom-0">
                <Dropdown.Root>
                    <Dropdown.DotsButton className="p-4" />

                    <Dropdown.Popover className="w-min">
                        <Dropdown.Menu>
                            <Dropdown.Item icon={Users01}>
                                <span className="pr-4">{team}</span>
                            </Dropdown.Item>
                            <Dropdown.Item icon={Server05}>
                                <span className="pr-4">{connected ? "Connected" : "Disconnected"}</span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown.Root>
            </div>
        </>
    );
};

export default GamePage;
