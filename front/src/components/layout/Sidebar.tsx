
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNotes } from "@/context/NotesContext";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FolderModal } from "@/components/folders/FolderModal";
import { Plus, MoreVertical, Edit, Trash2, Folder as FolderIcon, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  onCreateNote: (folderId: string) => void;
}

export function Sidebar({ onCreateNote }: SidebarProps) {
  const { folders, selectedFolderId, setSelectedFolder, deleteFolder, getNotesForFolder } = useNotes();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<any>(null);

  const token = JSON.parse(localStorage.getItem('user')).token;

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a pasta "${folderName}"? Todas as notas desta pasta serão perdidas.`)) {
      deleteFolder(folderId, token);
      toast({
        title: "Sucesso",
        description: "Pasta excluída com sucesso!"
      });
    }
  };

  const handleEditFolder = (folder: any) => {
    setEditingFolder(folder);
    setFolderModalOpen(true);
  };

  const handleCloseFolderModal = () => {
    setFolderModalOpen(false);
    setEditingFolder(null);
  };

  return (
    <>
      <div className="h-full bg-card border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-primary">EASY NOTES</h2>
          <p className="text-sm text-muted-foreground">Olá, {user?.name}!</p>
        </div>

        <div className="p-4 border-b">
          <Button
            onClick={() => setSelectedFolder('all')}
            variant={selectedFolderId === 'all' ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <FileText className="h-4 w-4 mr-2" />
            Todas as Notas ({getNotesForFolder('all').length})
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">PASTAS</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setFolderModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {folders.map((folder) => (
                <div key={folder.id} className="flex items-center group">
                  <Button
                    onClick={() => setSelectedFolder(folder.id)}
                    variant={selectedFolderId === folder.id ? 'default' : 'ghost'}
                    className="flex-1 justify-start"
                  >
                    <div className={`w-3 h-3 rounded-full ${folder.color} mr-2`} />
                    {folder.nome} ({getNotesForFolder(folder.id).length})
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onCreateNote(folder.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Nota
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditFolder(folder)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteFolder(folder.id, folder.nome)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t space-y-2">
          <ThemeToggle />
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>

      <FolderModal
        open={folderModalOpen}
        onClose={handleCloseFolderModal}
        folder={editingFolder}
      />
    </>
  );
}
