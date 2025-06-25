
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Note } from "@/context/NotesContext";
import { Edit, Trash2, X } from "lucide-react";

interface ViewNoteModalProps {
  open: boolean;
  onClose: () => void;
  note: Note | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function ViewNoteModal({ open, onClose, note, onEdit, onDelete }: ViewNoteModalProps) {
  if (!note) return null;

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-2">$1</h2>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, '<br />');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{note.title}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Criado em: {note.createdAt.toLocaleDateString('pt-BR')}
            {note.updatedAt > note.createdAt && (
              <span> • Editado em: {note.updatedAt.toLocaleDateString('pt-BR')}</span>
            )}
          </div>
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(note.content) }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
