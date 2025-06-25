
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-full justify-start"
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-4 w-4 mr-2" />
          Modo Escuro
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 mr-2" />
          Modo Claro
        </>
      )}
    </Button>
  );
}
