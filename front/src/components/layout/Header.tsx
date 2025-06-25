import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useNotes } from "@/context/NotesContext";

interface HeaderProps {
  onCreateNote: (folderId: string) => void;
  isMobile: boolean;
}

export function Header({ onCreateNote, isMobile }: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedFolderId, folders } = useNotes();

  const getCurrentFolderName = () => {
    if (selectedFolderId === 'all') return 'Todas as Notas';
    const folder = folders.find(f => f.id === selectedFolderId);
    return folder?.name || 'Pasta não encontrada';
  };

  const handleCreateNote = () => {
    const folderId = selectedFolderId === 'all' ? folders[0]?.id || 'personal' : selectedFolderId;
    onCreateNote(folderId);
  };

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-4 py-4" style={{ minHeight: 72 }}>
        <div className="flex items-center gap-4">
          {isMobile && (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <Sidebar onCreateNote={onCreateNote} />
              </SheetContent>
            </Sheet>
          )}
          <div>
            <h1 className="text-xl font-semibold">{getCurrentFolderName()}</h1>
          </div>
        </div>
        <Button onClick={handleCreateNote}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Nota
        </Button>
      </div>
    </header>
  );
}
