"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash01 } from "@untitledui/icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";

type QuestionItemType = {
    id: string;
    question: string;
    answer: string;
};

const QuizQuestionRow = ({ item, onAddItem, onRemoveItem }) => {
    const [question, setQuestion] = useState(item.question);
    const [answer, setAnswer] = useState(item.answer);

    useEffect(() => {
        item.question = question;
        item.answer = answer;
    }, [question, answer]);

    return (
        <div className="mb-4 flex gap-4">
            <Input placeholder="Type question here" size="md" value={question} onChange={setQuestion} />
            <Input
                placeholder="Type answer here"
                size="md"
                value={answer}
                onChange={setAnswer}
                onKeyDown={({ code }) => {
                    if (code === "Enter" && question && answer) {
                        onAddItem(item);
                    }
                }}
                className="w-100"
            />
            <Dropdown.Root>
                <Dropdown.DotsButton />

                <Dropdown.Popover className="w-min">
                    <Dropdown.Menu>
                        <Dropdown.Item icon={Plus} onAction={() => onAddItem(item)}>
                            <span className="pr-4">Add question</span>
                        </Dropdown.Item>
                        <Dropdown.Item icon={Trash01} onAction={() => onRemoveItem(item)}>
                            <span className="pr-4">Delete question</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown.Root>
        </div>
    );
};

const QuizTable = ({ items, onCreateGame, onAddItem, onRemoveItem }: { items: QuestionItemType[]; onCreateGame: any; onAddItem: any; onRemoveItem: any }) => {
    return (
        <>
            <div>
                <Button onClick={onCreateGame}>Create game</Button>
            </div>
            {items.map((item) => (
                <QuizQuestionRow item={item} key={item.id} onAddItem={onAddItem} onRemoveItem={onRemoveItem} />
            ))}
        </>
    );
};

const NewGamePage = () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

    const router = useRouter();
    const [items, setItems] = useState([{ id: "506c64a1-9a49-422d-bba6-55964d0e8c01", question: "", answer: "" }]);

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

    const onAddItem = (item) => {
        setItems((prevItems) => {
            const idx = prevItems.indexOf(item);
            const newItems = [...prevItems];

            if (idx !== -1) {
                const newItem = { id: crypto.randomUUID(), question: "", answer: "" };
                newItems.splice(idx + 1, 0, newItem);
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

    return (
        <>
            <div className="container mx-auto p-4">
                <QuizTable items={items} onCreateGame={onCreateGame} onAddItem={onAddItem} onRemoveItem={onRemoveItem} />
            </div>
        </>
    );
};

export default NewGamePage;
