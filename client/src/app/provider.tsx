"use client";
import QueryProvider from "@/components/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function Providers({ children }: Props) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryProvider>
      </ThemeProvider>
    </>
  );
}
