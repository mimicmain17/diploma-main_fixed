"use client";
import { BACKEND_URL } from "@/utils/urls";
import { Button, Link, getKeyValue } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const columns = [
  {
    key: "selected",
    label: "",
  },
  {
    key: "subject",
    label: "Предмет",
  },
  {
    key: "theme",
    label: "Тема",
  },
  {
    key: "date",
    label: "Дата выдачи",
  },
  {
    key: "deadline",
    label: "Дедлайн",
  },
  {
    key: "teacher",
    label: "Преподаватель",
  },
  {
    key: "file",
    label: "Файл",
  },
  {
    key: "comment",
    label: "Комментарий",
  },
  {
    key: "is_cheked",
    label: "Проверено",
  },
];

const Problems = () => {
  const [selectedKey, setSelectedKey] = useState<Set<string>>();
  const router = useRouter();
  const handleSubmit = () => {
    const selected_key = selectedKey?.values().next().value;
    const value: any = rows.find((row: any) => row.id === selected_key);
    if (value) {
      router.push(`/student/answer/${value?.id}`);
    }
  };

  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch(BACKEND_URL + "student/problems", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(async (res) => {
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login/";
      }
      if (res.status == 404) {
        setRows([]);
      } else {
        setRows(data);
      }
    });
  }, []);

  const [sorted, setSorted] = useState(false);
  const handleSubmitSortProblems = () => {
    if (!sorted) {
      setRows(rows.sort((a: any, b: any) => a.answer ? 1 : -1));
      setSorted(true); 
    } else {
      setRows(rows.sort((a: any, b: any) => a.answer ? -1 : 1));
      setSorted(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 px-2">
      <h2 className="text-center text-lg">Ваши задания на сегодня</h2>
      <div className="w-full flex flex-col items-center justify-center gap-y-2">
        <div>
          <Button
            color="primary"
            className="font-medium"
            onClick={handleSubmit}
          >
            К заданию
          </Button>
        </div>
        <div>
          <Button
            color="primary"
            className="font-medium"
            onClick={handleSubmitSortProblems}
          >
            Сортировать по нерешённым
          </Button>
        </div>
      </div>
      <Table
        color="default"
        selectionMode="single"
        selectedKeys={selectedKey}
        onSelectionChange={setSelectedKey as any}
        aria-label="problems"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item: any) => (
            <TableRow
              key={item.key}
              className={item.answer ? "bg-success" : "bg-red-400"}
            >
              <TableCell>
                <RadioGroup value={selectedKey?.values().next().value}>
                  <Radio value={item.key} />
                </RadioGroup>
              </TableCell>
              <TableCell>{item.subject}</TableCell>
              <TableCell>{item.theme}</TableCell>
              <TableCell>{item.created_at}</TableCell>
              <TableCell>{item.deadline}</TableCell>
              <TableCell>{item.teacher}</TableCell>
              <TableCell>
                <Link href={item.file} download={item.file}>
                  {item.file}
                </Link>
              </TableCell>
              <TableCell>{item.comment}</TableCell>
              <TableCell>{item.is_checked ? "Да" : "Нет"}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Problems;
