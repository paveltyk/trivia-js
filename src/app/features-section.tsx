import type { FC, HTMLAttributes } from "react";
import { ChromeCast, ClockStopwatch, Star06, Trophy01 } from "@untitledui/icons";
import Image from "next/image";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { CheckItemText } from "@/components/marketing/pricing-sections/base-components/pricing-tier-card";
import { cx } from "@/utils/cx";

const AlternateImageMockup: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
    return (
        <div
            className={cx(
                "size-full rounded-[9.03px] bg-primary p-[0.9px] shadow-modern-mockup-outer-md ring-[0.56px] ring-utility-gray-300 ring-inset md:rounded-[20.08px] md:p-0.5 md:shadow-modern-mockup-outer-lg md:ring-[1.25px] lg:absolute lg:w-auto lg:max-w-none",
                props.className,
            )}
        >
            <div className="size-full rounded-[7.9px] bg-primary p-0.5 shadow-modern-mockup-inner-md md:rounded-[17.57px] md:p-[3.5px] md:shadow-modern-mockup-inner-lg">
                <div className="relative size-full overflow-hidden rounded-[6.77px] ring-[0.56px] ring-utility-gray-200 md:rounded-[15.06px] md:ring-[1.25px]">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export const FeaturesSection = () => {
    return (
        <section className="flex flex-col gap-12 overflow-hidden bg-primary py-16 sm:gap-16 md:gap-20 md:py-24 lg:gap-24">
            <div className="mx-auto w-full max-w-container px-4 md:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                    <span className="text-sm font-semibold text-brand-secondary md:text-md">How it works</span>
                    <h2 className="mt-3 text-display-sm font-semibold text-primary md:text-display-md">Your Hosting Toolkit. Simplified</h2>
                    <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
                        Everything you need to create, customize, and run an engaging trivia night. Fast.
                    </p>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-container flex-col gap-12 px-4 sm:gap-16 md:gap-20 md:px-8 lg:gap-24">
                <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-2 lg:gap-24">
                    <div className="max-w-xl flex-1 self-center lg:order-last">
                        <FeaturedIcon icon={Star06} size="lg" color="brand" theme="light" />
                        <h2 className="mt-5 text-display-xs font-semibold text-primary md:text-display-sm">Add Questions Effortlessly</h2>
                        <p className="mt-2 text-md text-tertiary md:mt-4 md:text-lg">
                            <b className="text-secondary">Let AI write them, or bring your own.</b>
                            <br />
                            Paste from Google Sheets or type them manually. Or just tell our AI what kind of questions you need, and it’ll build a round for
                            your topic and audience.
                        </p>
                    </div>

                    <div className="relative w-full flex-1 lg:h-128">
                        <AlternateImageMockup className="lg:right-0">
                            {/* Light mode image (hidden in dark mode) */}
                            <Image
                                src="/screenshots/add-questions-ai.png"
                                width={3024}
                                height={1890}
                                alt="Dashboard mockup showing application interface"
                                className="size-full object-contain lg:w-auto lg:max-w-none dark:hidden"
                            />
                            {/* Dark mode image (hidden in light mode) */}
                            <Image
                                src="/screenshots/add-questions-ai-dark.png"
                                width={3024}
                                height={1890}
                                alt="Dashboard mockup showing application interface"
                                className="size-full object-contain not-dark:hidden lg:w-auto lg:max-w-none"
                            />
                        </AlternateImageMockup>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-2 lg:gap-24">
                    <div className="max-w-xl flex-1 self-center">
                        <FeaturedIcon icon={ChromeCast} size="lg" color="brand" theme="light" />
                        <h2 className="mt-5 text-display-xs font-semibold text-primary md:text-display-sm">Set Up the Big Screen</h2>
                        <p className="mt-2 text-md text-tertiary md:mt-4 md:text-lg">
                            <b className="text-secondary">Your game hub, ready for action.</b>
                            <br />
                            Display a live QR code, questions, and the leaderboard on a shared screen. Perfect for bars, classrooms, living rooms, or
                            livestreams.
                        </p>
                    </div>

                    <div className="relative w-full flex-1 lg:h-128">
                        <AlternateImageMockup className="lg:left-0">
                            {/* Light mode image (hidden in dark mode) */}
                            <Image
                                src="/screenshots/big-screen.png"
                                width={3024}
                                height={1890}
                                alt="Dashboard mockup showing application interface"
                                className="size-full object-contain lg:w-auto lg:max-w-none dark:hidden"
                            />
                            {/* Dark mode image (hidden in light mode) */}
                            <Image
                                src="/screenshots/big-screen-dark.png"
                                width={3024}
                                height={1890}
                                alt="Dashboard mockup showing application interface"
                                className="size-full object-contain not-dark:hidden lg:w-auto lg:max-w-none"
                            />
                        </AlternateImageMockup>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-2 lg:gap-24">
                    <div className="max-w-xl flex-1 self-center lg:order-last">
                        <FeaturedIcon icon={ClockStopwatch} size="lg" color="brand" theme="light" />
                        <h2 className="mt-5 text-display-xs font-semibold text-primary md:text-display-sm">Run the Show</h2>
                        <p className="mt-2 text-md text-tertiary md:mt-4 md:text-lg">
                            <b className="text-secondary">You’re the host. Keep the game flowing.</b>
                            <br />
                            Advance through each question when you’re ready. Watch teams answer in real-time, view their responses, and even make live
                            corrections if needed.
                        </p>
                    </div>

                    <div className="relative w-full flex-1 lg:h-128">
                        <AlternateImageMockup className="lg:right-0">
                            {/* Light mode image (hidden in dark mode) */}
                            <Image
                                src="/screenshots/run-game.png"
                                width={3024}
                                height={1890}
                                alt="Dashboard mockup showing application interface"
                                className="size-full object-contain lg:w-auto lg:max-w-none dark:hidden"
                            />
                            {/* Dark mode image (hidden in light mode) */}
                            <Image
                                src="/screenshots/run-game-dark.png"
                                width={3024}
                                height={1890}
                                alt="Dashboard mockup showing application interface"
                                className="size-full object-contain not-dark:hidden lg:w-auto lg:max-w-none"
                            />
                        </AlternateImageMockup>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-2 lg:gap-24">
                    <div className="max-w-xl flex-1 self-center">
                        <FeaturedIcon icon={Trophy01} size="lg" color="brand" theme="light" />
                        <h2 className="mt-5 text-display-xs font-semibold text-primary md:text-display-sm">Reveal the Leaderboard</h2>
                        <p className="mt-2 text-md text-tertiary md:mt-4 md:text-lg">
                            <b className="text-secondary">Celebrate the smartest team!</b>
                            <br />
                            Show who nailed each question, tally scores automatically, and reveal the final standings with a slick, animated leaderboard.
                        </p>
                    </div>

                    <div className="relative w-full flex-1 lg:h-128">
                        <AlternateImageMockup className="lg:left-0">
                            {/* Light mode image (hidden in dark mode) */}
                            <Image
                                src="/screenshots/leaderboard.png"
                                width={3024}
                                height={1890}
                                alt="Dashboard mockup showing application interface"
                                className="size-full object-contain lg:w-auto lg:max-w-none dark:hidden"
                            />
                            {/* Dark mode image (hidden in light mode) */}
                            <Image
                                src="/screenshots/leaderboard-dark.png"
                                width={3024}
                                height={1890}
                                alt="Dashboard mockup showing application interface"
                                className="size-full object-contain not-dark:hidden lg:w-auto lg:max-w-none"
                            />
                        </AlternateImageMockup>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
