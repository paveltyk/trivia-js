"use client";

import { Star07 } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icons";

export const StartScreen = ({ channel, game }) => {
    return (
        <div className="m-auto flex h-dvh max-w-lg flex-col">
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 md:px-8">
                <div className="flex w-full flex-col items-center gap-10">
                    <FeaturedIcon color="brand" icon={Star07} theme="outline" size="xl" className="animate-spin duration-5000" />
                    <h1 className="text-center text-display-xs font-semibold text-primary">Waiting for the host to start the game...</h1>
                </div>
            </div>
        </div>
    );
};
