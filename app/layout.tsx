"use client";
import "./globals.css";
import "/public/static/css/style.css";
import "/public/static/css/font-awesome-all.min.css";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState, createContext, ReactNode } from "react";
import ServiceWorker from "@/components/sw/sw";

interface ThemeContextProps {
  theme: string | null;
  setTheme: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ThemeContext = createContext<ThemeContextProps | null>(null);

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme === "" || storedTheme ? storedTheme : "");
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme !== "" && storedTheme !== "dark") {
      localStorage.setItem("theme", "");
    }
    document.querySelector("html")!.classList.value = localStorage.getItem("theme") || "";
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ServiceWorker />
      <html lang="en">
        <body>{children}</body>
      </html>
    </ThemeContext.Provider>
  );
}