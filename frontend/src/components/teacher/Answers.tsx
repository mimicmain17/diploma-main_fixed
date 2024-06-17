import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  RadioGroup,
  Radio,
  Link,
  Input,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "@/utils/urls";
import { useRouter } from "next/navigation";
import { getKeyValue } from "@/utils/faculties";

const Answers = ({ id }: { id: number }) => {
  const [selectedKey, setSelectedKey] = useState<Set<string>>();
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("");
  const [sorted, setSorted] = useState(false);

  const handleSubmitCheckAnswer = (is_right: boolean) => {
    const selected_key = selectedKey?.values().next().value;
    const value: any = rows.find((row: any) => row.id === selected_key);
    if (value) {
      fetch(BACKEND_URL + `answer/check/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id: value?.id, is_right }),
      }).then(async (res) => {
        setSelectedKey(new Set());
        setRows(
          rows.map((row: any) =>
            row.key === selected_key ? { ...row, checked: true } : row
          ) as any
        );
      });
    }
  };

  useEffect(() => {
    fetch(BACKEND_URL + `answer/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(async (res) => {
      if (res.status == 401) {
        window.location.href = "/login";
      } else if (res.status == 404) {
        setRows([]);
      } else {
        const data = await res.json();
        setRows(data);
      }
    });
  }, [id]);

  const handleSubmitSortAnswers = () => {
    if (!sorted) {
      setRows(rows.sort((a: any, b: any) => b.is_check - a.is_check));
      setSorted(true);
    } else {
      setRows(rows.sort((a: any, b: any) => a.is_check - b.is_check));
      setSorted(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 px-2">
      <div className="flex items-center">
        <div className="w-96"></div>
        <div className="w-full flex flex-col items-center gap-y-2">
          <h2 className="text-center text-lg">Режим просмотра ответов</h2>
          <div className="flex gap-x-2">
            <Button
              color="danger"
              className="font-medium"
              onClick={() => handleSubmitCheckAnswer(false)}
            >
              Неправильно
            </Button>
            <Button
              color="success"
              className="font-medium text-white"
              onClick={() => handleSubmitCheckAnswer(true)}
            >
              Правильно
            </Button>
          </div>
          <div>
            <Button
              color="primary"
              className="font-medium"
              onClick={handleSubmitSortAnswers}
            >
              Отсортировать по просмотренным заданиям
            </Button>
          </div>
        </div>
        <div className="w-96">
          <h3 className="text-center">Найти студента / факультет</h3>
          <Input onChange={(e) => setFilter(e.target.value.toLowerCase())} />
        </div>
      </div>
      <Table
        color="default"
        selectionMode="single"
        selectedKeys={selectedKey}
        onSelectionChange={setSelectedKey as any}
        aria-label="answers"
      >
        <TableHeader
          columns={[
            { key: "problem", label: "Задание" },
            { key: "studentFile", label: "Файл студента" },
            { key: "studentAnswer", label: "Ответ" },
            { key: "is_right", label: "Правильность ответа" },
            { key: "student", label: "Ответивший студент" },
          ]}
        >
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={rows.length > 0 ? rows.filter(
            (row: any) =>
              row.student.name.toLowerCase().includes(filter) ||
              getKeyValue(row.student.faculty)?.label.toLowerCase().includes(filter)
          ) : []}
        >
          {(item: any) => (
            <TableRow
              key={item.key}
              className={item.is_check ? "bg-success" : "bg-red-400"}
            >
              <TableCell>
                <RadioGroup
                  value={selectedKey ? selectedKey.values().next().value : ""}
                  isDisabled
                >
                  <Radio value={item.key} />
                </RadioGroup>
              </TableCell>
              <TableCell>
                <Link href={BACKEND_URL + item.file} download={item.file}>
                  {item.file}
                </Link>
              </TableCell>
              <TableCell>{item.text}</TableCell>
              <TableCell>{item.is_check && (item.is_right ? "Правильно" : "Неправильно")}</TableCell>
              <TableCell>
                {item.student.name}, {getKeyValue(item.student.faculty)?.label}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Answers;
