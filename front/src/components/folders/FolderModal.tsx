
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNotes, Folder } from "@/context/NotesContext";
import { useToast } from "@/hooks/use-toast";

interface FolderModalProps {
  open: boolean;
  onClose: () => void;
  folder?: Folder;
}

const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500'
];

export function FolderModal({ open, onClose, folder }: FolderModalProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-blue-500");
  const { createFolder, updateFolder } = useNotes();
  const { toast } = useToast();

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setSelectedColor(folder.color);
    } else {
      setName("");
      setSelectedColor("bg-blue-500");
    }
  }, [folder, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome para a pasta.",
        variant: "destructive"
      });
      return;
    }

    if (folder) {
      updateFolder(folder.id, name, selectedColor);
      toast({
        title: "Sucesso",
        description: "Pasta atualizada com sucesso!"
      });
    } else {
      createFolder(name, selectedColor);
      toast({
        title: "Sucesso",
        description: "Pasta criada com sucesso!"
      });
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {folder ? "Editar Pasta" : "Criar Nova Pasta"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Pasta</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome da pasta..."
            />
          </div>
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-12 h-12 rounded-lg ${color} ${
                    selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {folder ? "Salvar Alterações" : "Criar Pasta"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
