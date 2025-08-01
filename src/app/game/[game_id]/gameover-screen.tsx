"use client";

import LeaderboardCard from "@/app/game/[game_id]/admin/leaderboard-card";

export const GameoverScreen = ({ game }) => {
    return <LeaderboardCard game={game} />;
};
