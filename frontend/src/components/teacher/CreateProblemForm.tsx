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
  Autocomplete,
  Select,
  SelectItem,
  AutocompleteItem,
  DatePicker,
  Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { columns } from "./Problems";
import faculties, { getKeyValue } from "@/utils/faculties";

const CreateProblemForm = () => {
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState<any>("");
  const [deadline, setDeadline] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [theme, setTheme] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState("");
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/students/")
      .then(async (res) => await res.json())
      .then((data) => {
        setStudents(data);
      });
  }, []);


  const handleSubmit = () => {
    const body = new FormData()
    if (faculty) {
      body.append("faculty", faculty.values().next().value)
    }
    if (deadline) {
      body.append("deadline", deadline);
    }
    if (student) {
      body.append("students", student)
    }
    body.append("subject", subject)
    body.append("subject", subject)
    body.append("comment", comment)
    body.append("theme", theme)
    body.append("file", file as any)
    fetch("http://127.0.0.1:8000/problem/create/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body
  }).then((res) => {
      if (res.status === 201) {
        window.location.href = "/teacher";
      }
      if (res.status === 401) {
        window.location.href = "/login";
      }
    });
  };

  return (
    <div className="flex flex-col gap-y-2 px-2">
      <h2 className="text-center text-lg">Режим добавления заданий</h2>
      <div className="w-full flex justify-center">
        <div className="flex flex-col items-center gap-y-2">
          <Button
            color="primary"
            className="font-medium"
            onClick={handleSubmit}
          >
            Добавить
          </Button>
          <Select items={faculties} onSelectionChange={setFaculty} value={faculty} aria-label="faculty" label="Факультет">
            {(item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            )}
          </Select>
          <Autocomplete items={students} onSelectionChange={setStudent} value={student} aria-label="student" label="Студент">
            {(item: any) => (
              <AutocompleteItem key={item.id} value={item.id}>
                {item.name + ` (${getKeyValue(item?.faculty)?.label})`}
              </AutocompleteItem>
            )}
          </Autocomplete>
          <input type="file" onChange={(e) => { setFile(e.target.files && e.target.files[0] as any) }} />
        </div>
      </div>
      <Table aria-label="problem">
        <TableHeader
          columns={columns.filter((column) =>
            [
              "Предмет",
              "Тема",
              "Дедлайн",
              "Комментарий",
            ].includes(column.label)
          )}
        >
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </TableCell>
            <TableCell>
              <Input value={theme} onChange={(e) => setTheme(e.target.value)}/>
            </TableCell>
            <TableCell>
              <DatePicker value={deadline} onChange={setDeadline}/>
            </TableCell>
            <TableCell>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)}/>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CreateProblemForm;