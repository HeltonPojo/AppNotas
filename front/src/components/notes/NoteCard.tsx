
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Note } from "@/context/NotesContext";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NoteCardProps {
  note: Note;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const formatPreviewContent = (content: string) => {
  let formattedContent = content;

  // Preserve bold and italic
  formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Handle headings: convert to bold text for preview
  formattedContent = formattedContent.replace(/^#\s*(.*$)/gm, '<strong>$1</strong>');
  formattedContent = formattedContent.replace(/^##\s*(.*$)/gm, '<strong>$1</strong>');

  // Handle list items: convert to simple text with a bullet
  formattedContent = formattedContent.replace(/^- (.*$)/gm, '&bull; $1');

  // Remove extra newlines that might appear after formatting
  formattedContent = formattedContent.replace(/\n\s*\n/g, '<br />');
  formattedContent = formattedContent.replace(/\n/g, ' '); // Replace remaining newlines with spaces

  // Limit content intelligently
  const maxLength = 150;
  if (formattedContent.length > maxLength) {
    formattedContent = formattedContent.substring(0, maxLength).trim();
    // Ensure we don't cut in the middle of a word or HTML tag
    const lastSpace = formattedContent.lastIndexOf(' ');
    if (lastSpace > maxLength - 20) { // If the last space is close to the limit, cut there
      formattedContent = formattedContent.substring(0, lastSpace);
    }
    formattedContent += '...';
  }

  return formattedContent;
};

export function NoteCard({ note, onView, onEdit, onDelete }: NoteCardProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir esta nota?")) {
      onDelete();
      toast({
        title: "Sucesso",
        description: "Nota excluída com sucesso!"
      });
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 h-full flex flex-col border-border/50 hover:border-border">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className="text-lg font-semibold line-clamp-2 flex-1 cursor-pointer text-foreground hover:text-primary transition-colors"
            onClick={onView}
          >
            {note.titulo}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0 hover:bg-accent">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent onClick={onView} className="pt-0 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <p
            className="text-sm text-muted-foreground line-clamp-4 leading-relaxed prose prose-sm dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: formatPreviewContent(note.conteudo) }}
          />
        </div>
        <div className="pt-4 mt-auto">

        </div>
      </CardContent>
    </Card>
  );
}
//<p className="text-xs text-muted-foreground/80 font-medium">
//            {note.criado_em.toLocaleDateString('pt-BR', {
//              day: '2-digit',
//              month: '2-digit',
//              year: 'numeric'
//            })}
//          </p>


