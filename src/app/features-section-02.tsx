import { Heart, PencilLine, QrCode02, Star06 } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

export const FeaturesSection02 = () => {
    const faqs = [
        {
            question: "Effortless Setup",
            answer: "Create games in just a few clicks. No spreadsheets needed.",
            icon: Heart,
        },
        {
            question: "AI-Powered Questions",
            answer: "Let AI instantly generate questions tailored to your topic and audience.",
            icon: Star06,
        },
        {
            question: "Manual Flexibility",
            answer: "Write or paste your own questions when you want full creative control.",
            icon: PencilLine,
        },
        {
            question: "Player-Friendly",
            answer: "Players join on mobile with no app. Just scan and play.",
            icon: QrCode02,
        },
    ];

    return (
        <section className="bg-secondary py-16 md:py-24">
            <div className="mx-auto max-w-container px-4 md:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                    <h2 className="text-display-sm font-semibold text-primary md:text-display-md">Why You'll Love It</h2>
                    <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">Everything you need to get started. </p>
                </div>

                <div className="mt-12 md:mt-16">
                    <dl className="grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-10 sm:grid-cols-2 md:gap-y-16 lg:grid-cols-4">
                        {faqs.map((item) => (
                            <div key={item.question}>
                                <div className="flex max-w-sm flex-col items-center text-center">
                                    <FeaturedIcon color="gray" theme="modern" className="md:hidden" size="md" icon={item.icon} />
                                    <FeaturedIcon color="gray" theme="modern" className="hidden md:flex" size="lg" icon={item.icon} />

                                    <dt className="mt-4 text-lg font-semibold text-primary">{item.question}</dt>
                                    <dd className="mt-1 text-md text-tertiary">{item.answer}</dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection02;
