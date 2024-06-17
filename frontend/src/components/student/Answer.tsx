"use client";
import Solving from "./Answer/Solving";
import Header from "./Header";
import Problem from "./Problem";
import { useEffect, useState } from "react";

const Answer = ({ id }: { id: string }) => {
    const [row, setRow] = useState<any>({});
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/problem/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then(async (res) => {
            if (res.status === 401) {
                window.location.href = "/login";
            }
            const data = await res.json();
            setRow(data);
        });
    }, [id]);

    return (
        <main className="flex flex-col gap-y-4 pt-2">
            <Header backUrl="/student"/>
            <Problem row={row} />
            <Solving row={row} />
        </main>
    );
};

export default Answer;
