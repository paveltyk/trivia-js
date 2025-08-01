import { Card } from "@/app/game/[game_id]/admin/card";
import { RatingBadge } from "@/components/foundations/rating-badge";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";
import { cx } from "@/utils/cx";

const LeaderboardCard = ({ game }) => {
    const firstPlace = game.leaderboard[0];

    const getPulseDelay = (idx) => {
        const delays = ["delay-0", "delay-200", "delay-400", "delay-600", "delay-800"];
        const id = idx % delays.length;
        return delays[id];
    };

    return (
        <Card className="overflow-hidden">
            <div className="my-4 w-full">
                <div className="adjust-center relative mb-10 flex h-[125px]">
                    <BackgroundPattern
                        size="lg"
                        pattern="square"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping delay-100"
                    />
                    <BackgroundPattern size="lg" pattern="square" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
                    <RatingBadge
                        rating={5}
                        title={firstPlace.team}
                        subtitle={`${firstPlace.score} points`}
                        className="absolute top-1/2 left-1/2 m-auto -translate-x-1/2 -translate-y-1/2 scale-150 animate-ping justify-self-center opacity-4"
                    />
                    <RatingBadge rating={5} title={firstPlace.team} subtitle={`${firstPlace.score} points`} className="m-auto scale-150 justify-self-center" />
                </div>
                <div>
                    {game.leaderboard.map((row, idx) => (
                        <div
                            className={cx("flex animate-pulse justify-between border-secondary py-4 text-xl not-last:border-b last:pb-0", getPulseDelay(idx))}
                            key={row.team}
                        >
                            <div>
                                <span className="text-tertiary">#{idx + 1}</span> <span className="">{row.team}</span>
                            </div>
                            <div className="font-semibold">{row.score}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default LeaderboardCard;
