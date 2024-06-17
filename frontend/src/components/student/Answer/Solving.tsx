"use client";
import { BACKEND_URL } from "@/utils/urls";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { useEffect, useState } from "react";

const Solving = ({ row }: { row: any }) => {
    const id = row.id;
    const [text, setText] = useState<string>("");
    const [file, setFile] = useState(null);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const body = new FormData();
        body.append("text", text);
        if (file) body.append("file", file as any);
        body.append("id", id);
        body.append("problem", row.id);
        const res = await fetch(BACKEND_URL+"/answer/create/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: body,
        }).then((res) => {
            if (res.ok) {
                window.location.href = "/student";
            }
        });
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            window.location.href = "/login/student";
        }
    }, []);

    const Form = () => {
        return (
            <div className="flex justify-center">
                <div className="border p-3 rounded-lg shadow-xl flex flex-col gap-y-2">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-y-3"
                    >
                        <h1 className="text-center">Ваш ответ</h1>
                        <Textarea
                            placeholder="Ваш ответ"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <input
                            type="file"
                            onChange={(e) =>
                                setFile(
                                    e.target.files &&
                                        (e.target.files[-1] as any)
                                )
                            }
                        />
                        <Button
                            type="submit"
                            color="primary"
                            className="font-medium"
                        >
                            Отправить ответ
                        </Button>
                    </form>
                </div>
            </div>
        );
    };

    const Answer = ({ answer }: { answer?: any }) => {
        return (
            <div className="flex items-center flex-col">
                <div className="flex flex-col items-center gap-y-2 border p-3 rounded-lg shadow-xl">
                    <h1 className="text-xl font-semibold">Ваш ответ</h1>
                    <p>{answer?.text}</p>
                    {
                        answer.file &&<Link href={BACKEND_URL+"/"+answer?.file} download={answer?.file}>
                        Ссылка на файл
                    </Link>
                    }
                    <p className="text-violet-400">{answer?.is_check ? "Проверено" : "Не проверено"}</p>
                    {
                        answer?.is_check &&
                        (answer?.is_right ? <p className="text-green-400">Ответ правильный</p> : <p className="text-red-400">Ответ неправильный</p>)
                    }
                </div>
            </div>
        );
    };

    return row.answer ? (
        <Answer answer={row?.answer} />
    ) : (
        <div className="flex justify-center">
            <div className="border p-3 rounded-lg shadow-xl flex flex-col gap-y-2">
                <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
                    <h1 className="text-center">Ваш ответ</h1>
                    <Textarea
                        placeholder="Ваш ответ"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input
                        type="file"
                        onChange={(e) =>
                            setFile(
                                e.target.files && (e.target.files[0] as any)
                            )
                        }
                    />
                    <Button
                        type="submit"
                        color="primary"
                        className="font-medium"
                    >
                        Отправить ответ
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Solving;
