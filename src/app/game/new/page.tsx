"use client";

import "react";
import { File02, Star06 } from "@untitledui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PricingTierCardIcon } from "@/components/marketing/pricing-sections/base-components/pricing-tier-card";

const Page = () => {
    const router = useRouter();

    const plans = [
        {
            title: "Manual input",
            description: "Write or paste your own questions",
            features: ["Import from Google Sheets", "Copy/paste from any CSV or Excel", "Manually type Q&A", "Full flexibility over wording"],
            icon: File02,
            ctaText: "Start with Manual",
            onCtaClick: () => {
                router.push("/game/new/manual");
            },
        },
        {
            title: "AI-Generated",
            description: "Use AI to instantly generate questions",
            features: ["Just type a theme or idea", "Fast and automatic", "Easily edit or fine-tune", "Great for inspiration"],
            icon: Star06,
            ctaText: "Generate with AI",
            onCtaClick: () => {
                router.push("/game/new/ai");
            },
        },
    ];

    return (
        <section className="bg-primary py-16 text-center md:py-24">
            <div className="mx-auto max-w-container px-4 md:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col">
                    <p className="text-sm font-semibold text-brand-secondary md:text-md">New game</p>
                    <h2 className="mt-3 text-display-md font-semibold text-primary md:text-display-lg">How would you like to add questions to your game?</h2>
                    <p className="mt-4 text-lg text-tertiary md:mt-6 md:text-xl">
                        Whether you prefer to write your own or get a boost from AI, we’ve got you covered.
                    </p>
                </div>

                <div className="mt-16 flex w-full justify-center gap-4 md:mt-24 md:gap-8">
                    {plans.map((plan) => (
                        <PricingTierCardIcon key={plan.title} {...plan} className="max-w-lg min-w-md" />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Page;
