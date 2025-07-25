// Borrowed from https://github.com/Linen-dev/linen.dev/blob/27acb6442307ea205237cb7efb6792da5f88ba40/nextjs/hooks/websockets/index.tsx
import { useEffect, useState } from "react";
import { Channel, Socket } from "phoenix";

export type GameType = {
    currentQuestion: string;
    state: "initialized" | "game_started";
    leaderboard: Array<LeaderboardRowType>;
};
export type LeaderboardRowType = {
    team: string;
    score: integer;
};

interface Props {
    room?: string | null;
    params?: { [key: string]: any };
    onGameUpdated(game: GameType): void;
}

function useChannel({ room, params, onGameUpdated }: Props) {
    const [channel, setChannel] = useState<Channel>();
    const [connected, setConnected] = useState<boolean>(false);

    const onGameUpdatedHanler = (payload) => {
        const leaderboard: LeaderboardType = payload.leaderboard.map((row) => {
            return { team: row.team, score: row.score };
        });
        const game: GameType = {
            state: payload.game.state,
            currentQuestion: payload.game.current_question,
            leaderboard: leaderboard,
        };
        onGameUpdated(game);
    };

    useEffect(() => {
        if (room) {
            //Set url instead of hard coding
            const socket = new Socket(
                // `${process.env.NEXT_PUBLIC_PUSH_SERVICE_URL}/socket`,
                "ws://localhost:4000/socket",
            );

            socket.connect();
            const channel = socket.channel(room, params);

            setChannel(channel);

            channel
                .join()
                .receive("ok", (payload) => {
                    setConnected(true);
                })
                .receive("error", () => {
                    setConnected(false);
                });
            channel.on("game_updated", onGameUpdatedHanler);

            return () => {
                setConnected(false);
                socket.disconnect();
            };
        }

        return () => {};
    }, []);

    // TODO: Why is this?
    useEffect(() => {
        channel?.off("game_updated");
        channel?.on("game_updated", onGameUpdatedHanler);
    }, [onGameUpdated]);

    return { connected, channel };
}

export default useChannel;
