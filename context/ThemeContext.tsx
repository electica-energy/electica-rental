import { createContext, Dispatch, SetStateAction } from "react";

interface ThemeContextProps {
  theme: string | null;
  setTheme: Dispatch<SetStateAction<string | null>>;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

export default ThemeContext;