import { Note, CreateNote } from "@shared/schema";
import { nanoid } from "nanoid";

const STORAGE_KEY = "notes";

export const storage = {
  getNotes: (): Note[] => {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  },

  createNote: (note: CreateNote): Note => {
    const notes = storage.getNotes();
    const timestamp = Date.now();
    
    const newNote: Note = {
      id: nanoid(),
      ...note,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newNote, ...notes]));
    return newNote;
  },

  updateNote: (id: string, note: CreateNote): Note => {
    const notes = storage.getNotes();
    const updatedNote: Note = {
      id,
      ...note,
      createdAt: notes.find(n => n.id === id)?.createdAt || Date.now(),
      updatedAt: Date.now()
    };
    
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notes.map(n => n.id === id ? updatedNote : n))
    );
    
    return updatedNote;
  },

  deleteNote: (id: string): void => {
    const notes = storage.getNotes();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notes.filter(note => note.id !== id))
    );
  },

  searchNotes: (query: string): Note[] => {
    const notes = storage.getNotes();
    const searchTerm = query.toLowerCase();
    
    return notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm)
    );
  }
};
