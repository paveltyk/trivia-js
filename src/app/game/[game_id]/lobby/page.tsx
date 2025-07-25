"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

const GameLobyPage = () => {
    const router = useRouter();
    const params = useParams<{ game_id: string }>();
    const [team, setTeam] = useState();
    const submitTeam = () => {
        router.push(`/game/${params.game_id}?team=${team}`);
    };

    return (
        <>
            <div className="m-auto flex h-dvh max-w-3xl flex-col">
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 md:px-8">
                    <h1 className="mb-4 text-center text-display-sm font-semibold text-primary">What is your team name?</h1>
                    <Input placeholder="Example: Hyers" onChange={setTeam} className="mb-4" />
                    <Button onClick={submitTeam} className="mb-4">
                        Submit
                    </Button>
                </div>
            </div>
        </>
    );
};

export default GameLobyPage;
