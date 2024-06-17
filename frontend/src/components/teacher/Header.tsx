"use client";
import { BACKEND_URL } from "@/utils/urls";
import { Button, Link } from "@nextui-org/react";
import { useState, useEffect } from "react";
const Header = ({ backUrl }: { backUrl?: string }) => {

  const [teacher, setTeacher] = useState<any>({});

  useEffect(() => {
    fetch(BACKEND_URL+"/user/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(async (res) => {
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login";
      }
      if (data.role === "student") {
        window.location.href = "/student";
      }
      setTeacher(data);
    });
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="text-center text-lg font-semibold flex justify-between items-center px-4">
      <div className="w-32">
        {backUrl && (
          <Button
            as={Link}
            href={backUrl}
            color="primary"
            className="font-medium"
          >
            Вернуться
          </Button>
        )}
      </div>
      <div>
        {teacher.name && <h1>{teacher?.name}, добро пожаловать в кабинет преподавателя!</h1> }
      </div>
      <div className="w-32">
        <Button color="primary" className="font-medium" onClick={signOut}>
          Выйти
        </Button>
      </div>
    </header>
  );
};

export default Header;
