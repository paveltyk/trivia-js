"use client";

export const GameoverScreen = ({ channel, game }) => {
    return (
        <div>
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
