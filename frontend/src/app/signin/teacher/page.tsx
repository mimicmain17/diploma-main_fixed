"use client";
import { Button, Input, Link } from "@nextui-org/react";
import { BACKEND_URL } from "@/utils/urls";
import { useState } from "react";

const SigninTeacherPage = () => {
  const [isvalid, setIsValid] = useState(true);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("login");
    const password = data.get("password");
    const name = data.get("fullname");
    const inviteCode = data.get("inviteCode");

    let isRegistered = false;
    
    fetch(BACKEND_URL+"/register/teacher/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        name,
        inviteCode,
      }),
    }).then(async (res) => {
      if (res.ok) {
        window.location.href = "/login/teacher";
      }
      else {
        setIsValid(false);
      }
    })

    if (isRegistered) {
      fetch(BACKEND_URL+"/login/teacher/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }).then((async (res) => {
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("token", data.access);
          localStorage.setItem("refresh", data.refresh);
          window.location.href = "/student";
        }
        else {
          setIsValid(false);
        }
      }))
    }
  };
  
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 border rounded-lg p-4 m-4">
      <div className="flex justify-center mb-4">
  <Button as={Link} href="/login" color="default" variant="ghost" className="font-medium">
    На главную
  </Button>
</div>      
      <form
        method="post"
        action={"/api/auth/callback/credentials"}
        className="flex flex-col gap-y-3"
        onSubmit={handleSubmit}
        onChange={() => setIsValid(true)}
      >
        <h1 className="text-center text-lg">Регистрация преподавателя</h1>
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
        <Input
          placeholder="Код-приглашение"
          name="inviteCode"
          type="text"
          required
          isInvalid={!isvalid}
        />
        <Button type="submit" color="primary">
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
};

export default SigninTeacherPage;
