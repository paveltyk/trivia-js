// Borrowed from https://github.com/Linen-dev/linen.dev/blob/27acb6442307ea205237cb7efb6792da5f88ba40/nextjs/hooks/websockets/index.tsx
import { useEffect, useState } from "react";
import { Channel, Socket } from "phoenix";

export type GameType = {
    currentQuestion: string;
    state: "initialized" | "game_started";
    teamGuesses: any;
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
            teamGuesses: payload.game.team_guesses,
            leaderboard: leaderboard,
        };
        onGameUpdated(game);
    };

    useEffect(() => {
        if (room) {
            const socket = new Socket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

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
