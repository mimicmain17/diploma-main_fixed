"use client";
import faculties, { getKeyValue } from "@/utils/faculties";
import { BACKEND_URL } from "@/utils/urls";
import { Button, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";

const Header = ({ backUrl }: { backUrl?: string }) => {

  const [user, setUser] = useState<any>({});

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
      if (data.role === "teacher") {
        window.location.href = "/teacher";
      }
      setUser(data);
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
        { user?.name && <h1>{user.name}, добро пожаловать в кабинет студента!</h1>}
        
        {/* <p>Ваш факультет - {user?.faculty}</p> */}
        <p>Ваш факультет - {getKeyValue(user?.faculty)?.label}</p>
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
