"use client";

import { RatingBadge } from "@/components/foundations/rating-badge";

export const GameoverScreen = ({ channel, game }) => {
    const firstPlace = game.leaderboard[0];
    return (
        <div>
            <RatingBadge rating={5} title={firstPlace.team} subtitle={`${firstPlace.score} points`} className="m-auto" />
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
        </div>
    );
};
