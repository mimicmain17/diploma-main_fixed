"use client";
import faculties from "@/utils/faculties";
import { BACKEND_URL } from "@/utils/urls";
import { Button, Input, Select, SelectItem, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";

const SigninStudentPage = () => {
  const [isvalid, setIsValid] = useState(true);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("login");
    const password = data.get("password");
    const name = data.get("fullname");
    const faculty = data.get("faculty");
    
    fetch(BACKEND_URL+"/register/student/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        name,
        faculty,
      }),
    }).then(async (res) => {
      if (res.ok) {
        window.location.href = "/login/student";
      }
      else {
        setIsValid(false);
      }
    })
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 border rounded-lg p-4 m-4">
      <div className="flex justify-center mb-4">
  <Button as={Link} href="/login" color="default" variant="ghost" className="font-medium">
    На главную
  </Button>
</div>
      <form onSubmit={handleSubmit} onChange={() => setIsValid(true)} className="flex flex-col gap-y-3">
        <h1 className="text-center text-lg">Регистрация студента</h1>
        <Input placeholder="Логин" name="login" isInvalid={!isvalid} type="text" required/>
        <Input placeholder="Пароль" name="password" isInvalid={!isvalid} type="password" required/>
        <Input
          placeholder="ФИО"
          name="fullname"
          type="text"
          label="Как к вам обращаться?"
          required
          isInvalid={!isvalid}
        />
        <Select
          items={faculties}
          placeholder="Факультет"
          aria-label="faculty"
          name="faculty"
          required
          isInvalid={!isvalid}
        >
          {(faculty) => (
            <SelectItem key={faculty.key}>{faculty.label}</SelectItem>
          )}
        </Select>
        <Button type="submit" color="primary">
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
};

export default SigninStudentPage;
