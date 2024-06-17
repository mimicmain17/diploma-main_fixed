"use client";
import { NextUIProvider } from "@nextui-org/system";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    // <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    // </SessionProvider>
  );
};

export default Providers;
