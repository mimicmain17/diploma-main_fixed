"use client";
import { BACKEND_URL } from "@/utils/urls";
import { Button, Input, Link } from "@nextui-org/react";
import { useState } from "react";

const LoginStudentPage = () => {
  const [isvalid, setIsValid] = useState(true);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("login");
    const password = data.get("password");
    // signIn("credentials", {
    //   login,
    //   password,
    //   occupation: "student",
    //   callbackUrl: "/",
    // });
    fetch(BACKEND_URL+"/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access);
        localStorage.setItem('refresh', data.refresh);
        window.location.href = "/student";
      }
      else {
        setIsValid(false);
      }
    });
  }
  
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 border rounded-lg p-4 m-4">
           <div className="flex justify-center mb-4">
  <Button as={Link} href="/login" color="default" variant="ghost" className="font-medium">
    На главную
  </Button>
</div> 
      <form onSubmit={handleSubmit} onChange={() => setIsValid(true)} className="flex flex-col gap-y-3">
        <h1 className="text-center text-lg">Вход в кабинет студента</h1>
        <Input placeholder="Логин" name="login" type="text" isInvalid={!isvalid} />
        <Input placeholder="Пароль" name="password" isInvalid={!isvalid} type="password" />
        <Button type="submit" color="primary">
          Войти
        </Button>
      </form>
    </div>
  );
};

export default LoginStudentPage;
