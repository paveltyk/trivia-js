import { GamingPad01, Users01, XClose } from "@untitledui/icons";
import { Card } from "@/app/game/[game_id]/admin/card";
import { EmptyState as Content } from "@/components/application/empty-state/empty-state";
import { Avatar } from "@/components/base/avatar/avatar";
import { getInitials } from "@/components/base/avatar/utils";
import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { plural } from "@/my-components/utils";
import { cx } from "@/utils/cx";

const teamColors = [
    "bg-red-100",
    "bg-orange-100",
    "bg-amber-100",
    "bg-yellow-100",
    "bg-lime-100",
    "bg-green-100",
    "bg-emerald-100",
    "bg-teal-100",
    "bg-cyan-100",
    "bg-sky-100",
    "bg-blue-100",
    "bg-indigo-100",
    "bg-violet-100",
    "bg-purple-100",
    "bg-fuchsia-100",
    "bg-pink-100",
    "bg-rose-100",
    "bg-slate-100",
    "bg-zinc-100",
];
const getTeamColor = (team) => {
    const simpleHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    };

    const getItemFromList = (str, list) => {
        const hash = simpleHash(str);
        const index = Math.abs(hash) % list.length;
        return list[index];
    };

    return getItemFromList(team, teamColors);
};

export const TeamAvatar = ({ team, className }: { team: any; className?: any }) => {
    const initials = getInitials(team);
    const color = getTeamColor(team);

    return (
        <Tooltip title={team} arrow>
            <TooltipTrigger className="group relative flex cursor-pointer flex-col items-center gap-2 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-quaternary_hover focus:text-fg-quaternary_hover">
                <Avatar size="md" alt={team} initials={initials} className={cx("cursor-default", color, className)} />
            </TooltipTrigger>
        </Tooltip>
    );
};

export const TeamAvatarsGroup = ({ teams, className }) => {
    return (
        <div className={cx("flex -space-x-2", className)}>
            {teams.map((team) => (
                <TeamAvatar team={team} key={team} className="ring-[1.5px] ring-bg-primary" />
            ))}
        </div>
    );
};

export const TeamsCard = ({ game, onGameStart }) => {
    const teams = game?.teams || [];
    const teamsCount = teams.length || 0;
    const isEmpty = teamsCount === 0;
    const gameStarted = game?.state === "game_started";
    const gameOver = game?.state === "game_over";

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-center overflow-visible px-8 py-10">
                <Content size="sm">
                    <Content.Header pattern="circle">
                        <Content.FeaturedIcon color="gray" theme="light" icon={Users01} />
                    </Content.Header>

                    <Content.Content>
                        {isEmpty && (
                            <>
                                <Content.Title>No teams have joined the game yet</Content.Title>
                                <Content.Description>You can start now and let them join later.</Content.Description>
                            </>
                        )}
                        {!isEmpty && (
                            <>
                                <Content.Title>
                                    {teamsCount} {plural(teamsCount, "team", "teams")} {plural(teamsCount, "has", "have")} joined the game
                                </Content.Title>
                                <TeamAvatarsGroup teams={teams} className="my-4" />
                                <Content.Description>
                                    Go ahead and start the game.
                                    <br />
                                    More teams can join later.
                                </Content.Description>
                            </>
                        )}
                    </Content.Content>

                    <Content.Footer className="flex-col text-center">
                        <div className="pt-4">
                            {!(gameStarted || gameOver) && (
                                <Button size="md" iconLeading={GamingPad01} color={isEmpty ? "secondary" : "primary"} onClick={onGameStart}>
                                    Start game
                                </Button>
                            )}
                            {gameStarted && (
                                <Button size="md" iconLeading={GamingPad01} color={"secondary"} isDisabled>
                                    Game started
                                </Button>
                            )}
                            {gameOver && (
                                <Button size="md" iconLeading={XClose} color={"secondary"} isDisabled>
                                    Game over
                                </Button>
                            )}
                        </div>
                        <p className="max-w-sm text-xs text-tertiary">
                            Once you start the game, the big screen will show the first question, and all joined teams can answer on their devices.
                        </p>
                    </Content.Footer>
                </Content>
            </div>
        </Card>
    );
};

TeamsCard.Content = Content;
TeamsCard.Header = Content.Header;
TeamsCard.FeaturedIcon = Content.FeaturedIcon;
TeamsCard.Body = Content.Content;
TeamsCard.Title = Content.Title;
TeamsCard.Description = Content.Description;

export default TeamsCard;
