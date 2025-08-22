import { useEffect, useState } from "react";
import { ArrowRight } from "@untitledui/icons";
import { AnimatePresence, type Transition, motion } from "motion/react";
import { QuestionBullet } from "@/app/game/[game_id]/question-screen";
import { BadgeGroup } from "@/components/base/badges/badge-groups";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

const transition: Transition = {
    type: "spring",
    duration: 0.8,
};

const quizItems = [
    "What is the default male skin named in Minecraft?",
    "What is the largest island in the world?",
    "Which artist is associated with founding Cubism?",
    "Which is the largest state by area in the United States?",
    "According to myth, how many lives is a cat said to have?",
    "Which planet is the largest in our Solar System?",
].map((t) => t.split(" "));

const QuestionSlider = (props) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % quizItems.length);
        }, 5000);

        return () => clearInterval(interval); // cleanup on unmount
    }, [quizItems.length]);

    return (
        <>
            <figure className={cx("flex max-w-270 flex-col gap-8 overflow-hidden rounded-xl border border-primary bg-primary px-6 py-10", props.className)}>
                <AnimatePresence initial={true} mode="popLayout">
                    <motion.div
                        key={currentIndex + "-quote"}
                        initial={{ opacity: 0, scale: 0.98, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, transition: { ...transition, delay: 0.4 } }}
                        exit={{ opacity: 0, scale: 0.98, y: 20, transition: { ...transition, delay: 0.06 } }}
                        className="origin-bottom text-display-sm font-medium text-balance text-primary will-change-transform md:text-display-md"
                    >
                        <QuestionBullet number={currentIndex + 1} />
                    </motion.div>
                    <motion.div
                        key={currentIndex + "-author"}
                        initial={{ opacity: 0, scale: 0.98, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, transition: { ...transition, delay: 0.5 } }}
                        exit={{ opacity: 0, scale: 0.98, y: 20, transition }}
                        className="origin-bottom will-change-transform"
                    >
                        <motion.div aria-hidden="true">
                            {quizItems[currentIndex].map((word, index) => (
                                <motion.span
                                    key={`${currentIndex}-${index}`}
                                    initial={{ opacity: 0, scale: 0.9, y: 6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0, transition: { ...transition, delay: 0.5 + index * 0.1 } }}
                                    exit={{ opacity: 0, scale: 0.9, y: 6, transition: { ...transition, delay: 0 } }}
                                    className="text-display-xs"
                                >
                                    {word}{" "}
                                </motion.span>
                            ))}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </figure>
        </>
    );
};

export const HeroSection = () => {
    return (
        <>
            <section className="relative bg-primary py-16 lg:flex lg:min-h-180 lg:items-center lg:py-24">
                <div className="mx-auto flex w-full max-w-container items-center px-4 md:px-8">
                    <div className="flex flex-col items-start md:max-w-3xl lg:w-1/2 lg:pr-8">
                        <a href="/game/new/ai" className="rounded-[10px] outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2">
                            <BadgeGroup className="hidden md:flex" size="lg" addonText="Powered by AI" iconTrailing={ArrowRight} theme="modern" color="brand">
                                Make me a Quiz
                            </BadgeGroup>
                            <BadgeGroup className="md:hidden" size="md" addonText="Powered by AI" iconTrailing={ArrowRight} theme="modern" color="brand">
                                Make me a Quiz
                            </BadgeGroup>
                        </a>

                        <h1 className="mt-4 text-display-md font-semibold text-primary md:text-display-lg lg:text-display-xl">
                            Host Trivia Games the Easy Way
                        </h1>
                        <p className="mt-4 text-lg text-balance text-tertiary md:mt-6 md:max-w-lg md:text-xl">
                            Create unforgettable trivia nights in minutes — whether you're running pub nights, private parties, or online events.
                        </p>

                        <div className="mt-8 flex w-full flex-col items-stretch gap-4 md:mt-12 md:max-w-120 md:flex-row md:items-start">
                            <Button type="submit" size="xl" href="/game/new">
                                Create your first game
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="relative mt-16 flex h-60 w-full items-center justify-center bg-tertiary px-4 md:h-95 md:px-8 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-full lg:w-1/2 lg:px-12 dark:bg-secondary">
                    <QuestionSlider className="w-full" />
                </div>
            </section>
        </>
    );
};

export default HeroSection;
