import React, { createContext, useContext, useState } from 'react';

export interface Note {
  id: string;
  titulo: string;
  conteudo: string;
  pasta_id: string;
  criado_em: Date;
}

export interface Folder {
  id: string;
  nome: string;
  color: string;
}

interface NotesContextType {
  notes: Note[];
  folders: Folder[];
  selectedFolderId: string;
  getNotes: (token: string) => any;
  createNote: (titulo: string, conteudo: string, pasta_id: string, token: string) => void;
  updateNote: (id: string, titulo: string, conteudo: string, token: string) => void;
  deleteNote: (id: string, token: string) => void;
  getFolder: (token: string) => any;
  createFolder: (nome: string, color: string, token: string) => void;
  updateFolder: (id: string, nome: string, color: string, token: string) => void;
  deleteFolder: (id: string, token: string) => void;
  setSelectedFolder: (pasta_id: string) => void;
  getNotesForFolder: (pasta_id: string) => Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [selectedFolderId, setSelectedFolderId] = useState('all');

  const [folders, setFolders] = useState<Folder[]>([
  ]);

  const [notes, setNotes] = useState<Note[]>([
  ]);

  const getNotes = async (token: string) => {
    const res = await fetch("http://localhost/api/notas", {
      method: "GET",
      headers: { "Authorization": "Bearer " + token }
    });
    if (!res.ok)
      throw "Erro ao atualizar a nota";

    const data = await res.json();
    setNotes(data.notas);
    return data;
  };

  const createNote = async (titulo: string, conteudo: string, pasta_id: string, token: string) => {
    const res = await fetch("http://localhost/api/notas", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token },
      body: JSON.stringify({
        titulo,
        conteudo,
        pasta_id
      })
    });

    const data = await res.json();
    if (!res.ok)
      throw "Erro ao criar a nota";


    const newNote: Note = {
      id: data.id,
      titulo,
      conteudo,
      pasta_id,
      criado_em: new Date(),
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = async (id: string, titulo: string, conteudo: string, token: string) => {
    const res = await fetch(`http://localhost/api/notas/${id}`, {
      method: "PUT",
      headers: { "Authorization": "Bearer " + token },
      body: JSON.stringify({
        titulo,
        conteudo
      })
    });

    if (!res.ok)
      throw "Erro ao atualizar a nota";

    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, titulo, conteudo }
        : note
    ));
  };

  const deleteNote = async (id: string, token: string) => {
    const res = await fetch(`http://localhost/api/notas/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token },
    });

    if (!res.ok)
      throw "Erro ao atualizar a nota";

    setNotes(prev => prev.filter(note => note.id !== id));
  };


  const getFolder = async (token: string) => {
    const res = await fetch("http://localhost/api/pastas", {
      method: "GET",
      headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();
    setFolders(data)
    return data;
  };


  const createFolder = async (nome: string, color: string, token: string) => {
    const res = await fetch("http://localhost/api/pastas", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token },
      body: JSON.stringify({
        nome,
        color
      })
    });

    if (!res.ok)
      throw "Erro ao criar pasta";

    const data = await res.json();

    const newFolder: Folder = {
      id: data.id,
      nome,
      color
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const updateFolder = async (id: string, nome: string, color: string, token: string) => {
    const res = await fetch(`http://localhost/api/pastas/${id}`, {
      method: "PUT",
      headers: { "Authorization": "Bearer " + token },
      body: JSON.stringify({
        nome,
        color
      })
    });

    if (!res.ok)
      throw "Erro ao atualizar a nota";


    setFolders(prev => prev.map(folder =>
      folder.id === id ? { ...folder, nome, color } : folder
    ));
  };

  // TODO: Mudar aqui para apagar no Endpoint
  const deleteFolder = async (id: string, token: string) => {
    const res = await fetch(`http://localhost/api/pastas/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token },
    });

    if (!res.ok)
      throw "Erro ao atualizar a nota";


    setFolders(prev => prev.filter(folder => folder.id !== id));
    setNotes(prev => prev.filter(note => note.pasta_id !== id));
    if (selectedFolderId === id) {
      setSelectedFolderId('all');
    }
  };

  const setSelectedFolder = (pasta_id: string) => {
    setSelectedFolderId(pasta_id);
  };

  const getNotesForFolder = (pasta_id: string) => {
    if (pasta_id === 'all') return notes;
    return notes.filter(note => note.pasta_id === pasta_id);
  };
  return (
    <NotesContext.Provider value={{
      notes,
      folders,
      selectedFolderId,
      getNotes,
      createNote,
      updateNote,
      deleteNote,
      getFolder,
      createFolder,
      updateFolder,
      deleteFolder,
      setSelectedFolder,
      getNotesForFolder
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
