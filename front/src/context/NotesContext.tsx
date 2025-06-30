
import React, { createContext, useContext, useState } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
}

interface NotesContextType {
  notes: Note[];
  folders: Folder[];
  selectedFolderId: string;
  createNote: (title: string, content: string, folderId: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  createFolder: (name: string, color: string) => void;
  updateFolder: (id: string, name: string, color: string) => void;
  deleteFolder: (id: string) => void;
  setSelectedFolder: (folderId: string) => void;
  getNotesForFolder: (folderId: string) => Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [selectedFolderId, setSelectedFolderId] = useState('all');

  // TODO: Mudar aqui para pegar do Endpoint
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'personal', name: 'Pessoal', color: 'bg-blue-500' },
    { id: 'work', name: 'Trabalho', color: 'bg-green-500' },
    { id: 'ideas', name: 'Ideias', color: 'bg-purple-500' },
  ]);

  // TODO: Mudar aqui para pegar do Endpoint
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Minha primeira nota',
      content: 'Esta é uma nota de exemplo com **texto em negrito** e *itálico*.',
      folderId: 'personal',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Lista de tarefas',
      content: '# Tarefas do dia\n\n- Revisar projeto\n- Fazer exercícios\n- Ler livro',
      folderId: 'work',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  // TODO: Mudar aqui para criar no Endpoint
  const createNote = (title: string, content: string, folderId: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      folderId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [...prev, newNote]);
  };

  // TODO: Mudar aqui para atualizar no Endpoint
  const updateNote = (id: string, title: string, content: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id
        ? { ...note, title, content, updatedAt: new Date() }
        : note
    ));
  };

  // TODO: Mudar aqui para apagar no Endpoint
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // TODO: Mudar aqui para criar no Endpoint
  const createFolder = (name: string, color: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      color
    };
    setFolders(prev => [...prev, newFolder]);
  };

  // TODO: Mudar aqui para atualizar no Endpoint
  const updateFolder = (id: string, name: string, color: string) => {
    setFolders(prev => prev.map(folder =>
      folder.id === id ? { ...folder, name, color } : folder
    ));
  };

  // TODO: Mudar aqui para apagar no Endpoint
  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
    setNotes(prev => prev.filter(note => note.folderId !== id));
    if (selectedFolderId === id) {
      setSelectedFolderId('all');
    }
  };

  const setSelectedFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
  };

  // TODO: Mudar aqui para apagar no Endpoint
  const getNotesForFolder = (folderId: string) => {
    if (folderId === 'all') return notes;
    return notes.filter(note => note.folderId === folderId);
  };

  return (
    <NotesContext.Provider value={{
      notes,
      folders,
      selectedFolderId,
      createNote,
      updateNote,
      deleteNote,
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
