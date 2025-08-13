"use client";

import { useState } from "react";
import { CornerDownLeft, GamingPad01, InfoCircle, Plus, Star06, User01 } from "@untitledui/icons";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { SectionHeader } from "@/app/game/[game_id]/admin/section";
import { QuizTable } from "@/app/game/new/quiz-table";
import { Separator } from "@/app/game/new/separator";
import { Button } from "@/components/base/buttons/button";
import { InputBase } from "@/components/base/input/input";
import { InputGroup } from "@/components/base/input/input-group";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

const LoadingResponse = () => {
    return (
        <div className="flex h-6 w-5 items-center justify-between gap-1 self-start">
            <div className="size-1 animate-bounce rounded-full bg-fg-tertiary [animation-delay:-0.3s]"></div>
            <div className="size-1 animate-bounce rounded-full bg-fg-quaternary [animation-delay:-0.15s]"></div>
            <div className="size-1 animate-bounce rounded-full bg-fg-tertiary"></div>
        </div>
    );
};
const Page = () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;
    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);
    const [prompt, setPrompt] = useState("");
    const [lastResponse, setLastResponse] = useState<{ id: string; assumptions: string }>();
    const [conversation, setConversation] = useState<any[]>([]);

    const onCreateGame = () => {
        const props = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questions: items }),
        };

        fetch(`${apiUrl}/game`, props)
            .then((res) => res.json())
            .then(({ game_id }) => router.push(`/game/${game_id}/admin`))
            .catch((err) => console.error("Error", err));
    };

    const addItem = (item) => {
        setItems((prevItems) => {
            const idx = prevItems.indexOf(item);
            const newItems = [...prevItems];
            const newItem = { id: uuidv4(), question: "", answer: "" };

            if (idx !== -1) {
                newItems.splice(idx + 1, 0, newItem);
            } else {
                newItems.push(newItem);
            }

            return newItems;
        });
    };

    const onRemoveItem = (item) => {
        setItems((prevItems) => {
            const idx = prevItems.indexOf(item);
            const newItems = [...prevItems];

            if (idx !== -1) {
                newItems.splice(idx, 1);
            }

            if (newItems.length > 0) {
                return newItems;
            } else {
                return [{ id: crypto.randomUUID(), question: "", answer: "" }];
            }
        });
    };

    const handleOpenAIResponse = (response) => {
        setItems(response.items);
        setLastResponse(response);
        replyConversation(response.message);
    };

    const appendConversation = (prompt) => {
        setConversation((prev) => {
            return [...prev, { id: Date.now(), prompt: prompt, response: null }];
        });
    };

    const replyConversation = (response) => {
        setConversation((prev) => {
            const dup = [...prev];
            const last = dup.pop();
            return [...dup, { ...last, response }];
        });
    };

    const onFormSubmit = (e) => {
        e.preventDefault();

        if (!prompt) {
            return;
        }

        appendConversation(prompt);
        setPrompt("");

        const props = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt, previous_response_id: lastResponse?.id }),
        };

        fetch(`${apiUrl}/openai`, props)
            .then((res) => res.json())
            .then(handleOpenAIResponse)
            .catch((err) => console.error("Error", err));
    };

    return (
        <main className="container mx-auto max-w-5xl pt-8 pb-16 lg:pt-12 lg:pb-24">
            <div className="flex flex-col gap-6">
                <SectionHeader
                    title="Use AI magic to build your next trivia game"
                    text="Start by giving a short description of your trivia round, then customize it further with specific details."
                    contentTrailing={
                        <Button onClick={onCreateGame} color={items.length > 0 ? "primary" : "secondary"} size="lg" iconLeading={GamingPad01}>
                            Create game
                        </Button>
                    }
                />
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <form onSubmit={onFormSubmit}>
                                <InputGroup
                                    isRequired
                                    onChange={setPrompt}
                                    value={prompt}
                                    aria-label="Prompt for AI"
                                    trailingAddon={
                                        <Button color="secondary" type="submit" isDisabled={!prompt}>
                                            <CornerDownLeft className={conversation.at(-1) && !conversation.at(-1).response ? "animate-pulse" : ""} />
                                        </Button>
                                    }
                                >
                                    <InputBase
                                        placeholder={
                                            conversation.length === 0
                                                ? "Example: I need five questions about Olympic games 2024"
                                                : conversation.at(-1).response
                                                  ? ""
                                                  : "Waiting for AI..."
                                        }
                                    />
                                </InputGroup>
                            </form>
                            {conversation.slice(-1).map(({ id, prompt, response }) => {
                                return (
                                    <blockquote
                                        key={id}
                                        className={cx(
                                            "relative flex flex-col gap-2 rounded-lg bg-primary px-3 py-2 text-md ring-1 ring-secondary ring-inset before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border-l-[3px]",
                                            response ? "before:border-brand" : "text-tertiary before:border-gray-300",
                                        )}
                                    >
                                        <div className="flex w-full gap-1.5 text-tertiary">
                                            <User01 className="mt-1.5 size-3 flex-none stroke-gray-600" />
                                            <span className="w-full">{prompt}</span>
                                            {lastResponse?.assumptions && (
                                                <div>
                                                    <Tooltip
                                                        placement="bottom right"
                                                        title={
                                                            <span className="flex gap-1">
                                                                <Star06 className="size-4" /> AI assumptions
                                                            </span>
                                                        }
                                                        description={lastResponse.assumptions}
                                                    >
                                                        <TooltipTrigger className="group relative flex flex-col items-center gap-2 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-quaternary_hover focus:text-fg-quaternary_hover">
                                                            <InfoCircle className="size-4" />
                                                        </TooltipTrigger>
                                                    </Tooltip>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Star06 className={cx("mt-1.5 size-3 flex-none", response ? "stroke-brand-600" : "stroke-gray-600")} />
                                            {response && <span>{response}</span>}
                                            {!response && <LoadingResponse />}
                                        </div>
                                    </blockquote>
                                );
                            })}
                        </div>
                        {items.length > 0 && (
                            <>
                                <Separator>Questions and Answers</Separator>
                                <QuizTable items={items} onAddItem={addItem} onRemoveItem={onRemoveItem} />
                                <Separator>
                                    <Button color="secondary" iconLeading={Plus} onClick={addItem}></Button>
                                </Separator>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;
