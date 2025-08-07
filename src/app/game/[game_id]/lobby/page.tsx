"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

const GameLobyPage = () => {
    const router = useRouter();
    const params = useParams<{ game_id: string }>();
    const [team, setTeam] = useState<string | undefined>();

    const submitTeam = (e) => {
        e.preventDefault();
        router.push(`/game/${params.game_id}?team=${team}`);
    };

    return (
        <>
            <div className="m-auto flex h-dvh max-w-lg flex-col">
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 md:px-8">
                    <form onSubmit={submitTeam} className="flex w-full flex-col items-center gap-4">
                        <h1 className="text-center text-display-xs font-semibold text-primary">What is your team name?</h1>
                        <Input placeholder="Example: Golden Falcon" onChange={setTeam} size="md" />
                        <Button onClick={submitTeam} className="w-full" type="submit" size="lg" color={team ? "primary" : "secondary"} isDisabled={!team}>
                            Join
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default GameLobyPage;
