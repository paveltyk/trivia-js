"use client";

import { useEffect, useState } from "react";
import { GamingPad01, Plus } from "@untitledui/icons";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { SectionHeader } from "@/app/game/[game_id]/admin/section";
import { QuizTable } from "@/app/game/new/quiz-table";
import { Separator } from "@/app/game/new/separator";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { TextArea } from "@/components/base/textarea/textarea";

const NewGamePage = () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);

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

    const [text, setText] = useState("");

    const parseTextareaValue = (value) => {
        const newItems = value
            .split(/\r?\n/)
            .map((row) => row.trim())
            .filter((row) => row)
            .map((row) => row.split("\t"))
            .map(([q, a]) => {
                return { id: uuidv4(), question: q, answer: a };
            });
        setItems(newItems);
    };

    const handleTextareaChange = (e) => {
        const value = e.target.value;
        parseTextareaValue(value);
        setText(value);
    };

    const handleTextareaKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();

            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const value = textarea.value;
            const newValue = value.substring(0, start) + "\t" + value.substring(end);

            textarea.value = newValue;
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
    };
    return (
        <>
            <main className="container mx-auto max-w-5xl pt-8 pb-16 lg:pt-12 lg:pb-24">
                <div className="flex flex-col gap-6">
                    <SectionHeader
                        title="Host a new game"
                        text="Drop your questions and answers below. Google Sheets works great too!"
                        contentTrailing={
                            <Button onClick={onCreateGame} color={items.length > 0 ? "primary" : "secondary"} size="lg" iconLeading={GamingPad01}>
                                Create game
                            </Button>
                        }
                    />
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-10">
                            <TextArea
                                rows={10}
                                onChange={handleTextareaChange}
                                onKeyDown={handleTextareaKeyDown}
                                placeholder="Paste content from Google Sheets or type your questions and answers here. Each line should contain one question and answer, separated by a Tab."
                                aria-label="You can paste a two-column Google spreadsheet with questions and answers here."
                            />
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
        </>
    );
};

export default NewGamePage;
