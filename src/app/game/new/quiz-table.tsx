import { useEffect, useState } from "react";
import { Plus, Trash01 } from "@untitledui/icons";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";

type QuestionItemType = {
    id: string;
    question: string;
    answer: string;
};

export const QuizQuestionRow = ({ item, onAddItem, onRemoveItem }) => {
    const [question, setQuestion] = useState(item.question);
    const [answer, setAnswer] = useState(item.answer);

    useEffect(() => {
        item.question = question;
        item.answer = answer;
    }, [question, answer]);

    return (
        <div className="flex gap-4">
            <Input placeholder="Question" size="md" value={question} onChange={setQuestion} />
            <Input
                placeholder="Answer"
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

export const QuizTable = ({ items, onAddItem, onRemoveItem }: { items: QuestionItemType[]; onAddItem: any; onRemoveItem: any }) => {
    return (
        <div className="flex flex-col gap-4">
            {items.map((item) => (
                <QuizQuestionRow item={item} key={item.id} onAddItem={onAddItem} onRemoveItem={onRemoveItem} />
            ))}
        </div>
    );
};
