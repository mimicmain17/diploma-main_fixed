"use client";
import { Button, Link } from "@nextui-org/react";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/utils/urls";
import { getKeyValue } from "@/utils/faculties";

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
    key: "file",
    label: "Файл",
  },
  {
    key: "comment",
    label: "Комментарий",
  },
  {
    key: "given",
    label: "Конкретный студент / Факультет",
  },
];

const Problems = () => {
  const [selectedKey, setSelectedKey] = useState<Set<string>>();
  const [rows, setRows] = useState([]);
  const [answers, setAnswers] = useState([]);
  const router = useRouter();

  const handleSubmit = () => {
    const selected_key = selectedKey?.values().next().value;
    const value: any = rows.find((row: any) => row.id === selected_key);
    if (value) {
      router.push(`/teacher/check/${value?.id}`);
    }
  };

  const handleSubmitDeleteProblem = () => {
    const selected_key = selectedKey?.values().next().value;
    const value: any = rows.find((row: any) => row.id === selected_key);

    if (value) {
      fetch(BACKEND_URL+'/delete/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id: value?.id }),
      }).then(async (res) => {
        if (res.status === 200) {
          setRows(rows.filter((row: any) => row.id !== selected_key));
        }
      });
    }
  };

  useEffect(() => {
    fetch(BACKEND_URL+'/teacher/problems', {
        method: "GET",
        headers:  {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    }).then(async (res) => {
        const data = await res.json();
        if (res.status === 401) {
          window.location.href = "/login/";
        }
        setRows(data);
        console.log(data)
    });

    fetch(BACKEND_URL+'/answers/', {
        method: "GET",
        headers:  {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    }).then(async (res) => {
        const data = await res.json();
        if (res.status === 401) {
          window.location.href = "/login/";
        }
        setAnswers(data);
    });
  }, [])

  return (
    <div className="flex flex-col gap-y-2 px-2">
      <h2 className="text-center text-lg">Задания студентов</h2>
      <div className="w-full flex flex-col items-center gap-y-2">
        <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-6 w-full md:w-auto">
          <Button
            color="primary"
            className="font-medium w-full md:w-auto"
            as={Link}
            href="/teacher/create"
          >
            Режим добавления заданий
          </Button>
          <Button
            color="primary"
            className="font-medium w-full md:w-auto"
            onClick={handleSubmit}
          >
            Режим просмотра ответов
          </Button>
        </div>
        <div>
          <Button
            color="primary"
            className="font-medium"
            onClick={handleSubmitDeleteProblem}
          >
            Удалить
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
            <TableRow key={item.key}>
              <TableCell>
                <RadioGroup
                  value={selectedKey?.values().next().value}
                  isDisabled
                >
                  <Radio value={item.key} />
                </RadioGroup>
              </TableCell>
              <TableCell>{item.subject}</TableCell>
              <TableCell>{item.theme}</TableCell>
              <TableCell>{item.created_at}</TableCell>
              <TableCell>{item.deadline}</TableCell>
              <TableCell>
                <Link href={item.file} download={item.file}>
                  {item.file}
                </Link>
              </TableCell>
              <TableCell>{item.comment}</TableCell>
              <TableCell>{item.students[0]?.name || getKeyValue(item.faculty)?.label}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Problems;
