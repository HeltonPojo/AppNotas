
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";
import { ThemeToggle } from "@/components/ThemeToggle";

export function LoginPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleSwitchToRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full bg-card rounded-lg shadow-xl p-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">EASY NOTES</h1>
          <p className="text-muted-foreground">
            Organize suas ideias de forma simples e eficiente
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => setLoginOpen(true)}
            className="w-full"
            size="lg"
          >
            Entrar
          </Button>
          <Button 
            onClick={() => setRegisterOpen(true)}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Criar Conta
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Uma ferramenta moderna para suas anotações com suporte a rich text,
            organização por pastas e temas personalizáveis.
          </p>
        </div>
      </div>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}
