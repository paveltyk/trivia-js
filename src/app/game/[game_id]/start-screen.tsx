"use client";

import { Button } from "@/components/base/buttons/button";

export const StartScreen = ({ channel, game }) => {
    return (
        <div className="text-center">
            <h1 className="mb-4 text-center text-display-sm text-primary">Waiting for the host to start the game...</h1>
        </div>
    );
};
