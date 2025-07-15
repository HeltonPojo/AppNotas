import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteModal } from "@/components/notes/NoteModal";
import { ViewNoteModal } from "@/components/notes/ViewNoteModal";
import { useNotes, Note } from "@/context/NotesContext";

export function Dashboard() {
  const isMobile = useIsMobile();
  const { selectedFolderId, getNotes, getFolder, getNotesForFolder, deleteNote } = useNotes();
  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [createNoteFolderId, setCreateNoteFolderId] = useState<string>('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);


  const token = JSON.parse(localStorage.getItem('user')).token;
  useEffect(() => {
    if (token) {
      getNotes(token).catch((err: any) => console.error(err));
      getFolder(token).catch((err: any) => console.error(err));
    }
  }, []);

  const notes = getNotesForFolder(selectedFolderId, token);

  const handleCreateNote = (folderId: string) => {
    setCreateNoteFolderId(folderId);
    setCreateNoteOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setViewingNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId, token);
    setViewingNote(null);
  };

  const handleViewNote = (note: Note) => {
    setViewingNote(note);
  };

  return (
    <div className="h-screen flex">
      {!isMobile && (
        <div className="w-80 shrink-0">
          <Sidebar onCreateNote={handleCreateNote} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onCreateNote={handleCreateNote} isMobile={isMobile} />

        <main className="flex-1 overflow-y-auto p-6">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-muted-foreground mb-4">
                <h3 className="text-lg font-medium mb-2">Nenhuma nota encontrada</h3>
                <p>Crie sua primeira nota para começar a organizar suas ideias!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onView={() => handleViewNote(note)}
                  onEdit={() => handleEditNote(note)}
                  onDelete={() => handleDeleteNote(note.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <NoteModal
        open={createNoteOpen}
        onClose={() => {
          setCreateNoteOpen(false);
          setCreateNoteFolderId('');
        }}
        folderId={createNoteFolderId}
      />

      <NoteModal
        open={!!editingNote}
        onClose={() => setEditingNote(null)}
        note={editingNote || undefined}
      />

      <ViewNoteModal
        open={!!viewingNote}
        onClose={() => setViewingNote(null)}
        note={viewingNote}
        onEdit={() => handleEditNote(viewingNote!)}
        onDelete={() => handleDeleteNote(viewingNote!.id)}
      />
    </div>
  );
}
