"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash01 } from "@untitledui/icons";
import { useRouter } from "next/navigation";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Input } from "@/components/base/input/input";
import useChannel from "@/hooks/use-channel";

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
        <Table.Row id={item.id}>
            <Table.Cell>
                <Input placeholder="Type question here" size="md" value={question} onChange={setQuestion} />
            </Table.Cell>
            <Table.Cell>
                <Input placeholder="Type answer here" size="md" value={answer} onChange={setAnswer} className="w-100" />
            </Table.Cell>
            <Table.Cell className="px-4">
                <div className="flex justify-end gap-0.5">
                    <ButtonUtility size="xs" color="tertiary" tooltip="Add question" icon={Plus} onClick={() => onAddItem(item)} />
                    <ButtonUtility size="xs" color="tertiary" tooltip="Delete question" icon={Trash01} onClick={() => onRemoveItem(item)} />
                </div>
            </Table.Cell>
        </Table.Row>
    );
};

const QuizTable = ({ items, onCreateGame, onAddItem, onRemoveItem }: { items: QuestionItemType[]; onCreateGame: any; onAddItem: any; onRemoveItem: any }) => {
    return (
        <TableCard.Root>
            <TableCard.Header
                title="Trivia questions"
                contentTrailing={
                    <div className="flex items-center gap-3">
                        <Button
                            size="md"
                            iconLeading={Plus}
                            onClick={() => {
                                onCreateGame(items);
                            }}
                        >
                            Create game
                        </Button>
                    </div>
                }
            />
            <Table aria-label="Trivia questions">
                <Table.Header>
                    <Table.Head id="question" label="Question" isRowHeader className="w-full" />
                    <Table.Head id="answer" label="Answer" isRowHeader />
                    <Table.Head id="actions" />
                </Table.Header>

                <Table.Body items={items}>
                    {(item) => <QuizQuestionRow item={item} key={item.id} onAddItem={onAddItem} onRemoveItem={onRemoveItem} />}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};

const NewGamePage = () => {
    const router = useRouter();
    const [items, setItems] = useState([{ id: "506c64a1-9a49-422d-bba6-55964d0e8c01", question: "", answer: "" }]);

    const { connected, channel } = useChannel({
        room: `game:lobby`,
        params: { admin: true },
    });

    const startGame = () => {
        channel.push("start_game");
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

    const onCreateGame = () => {
        channel.push("create_game", { questions: items }).receive("ok", ({ game_id }) => {
            router.push(`/game/${game_id}/admin`);
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
