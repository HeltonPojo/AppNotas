
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "./RichTextEditor";
import { useNotes, Note } from "@/context/NotesContext";
import { useToast } from "@/hooks/use-toast";

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  note?: Note;
  folderId?: string;
}

export function NoteModal({ open, onClose, note, folderId }: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createNote, updateNote } = useNotes();
  const { toast } = useToast();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um título para a nota.",
        variant: "destructive"
      });
      return;
    }

    if (note) {
      updateNote(note.id, title, content);
      toast({
        title: "Sucesso",
        description: "Nota atualizada com sucesso!"
      });
    } else if (folderId) {
      createNote(title, content, folderId);
      toast({
        title: "Sucesso",
        description: "Nota criada com sucesso!"
      });
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {note ? "Editar Nota" : "Criar Nova Nota"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da nota..."
            />
          </div>
          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Digite o conteúdo da sua nota..."
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {note ? "Salvar Alterações" : "Criar Nota"}
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
