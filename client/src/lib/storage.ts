import { Note, CreateNote, Todo, CreateTodo } from "@shared/schema";
import { nanoid } from "nanoid";

const NOTES_STORAGE_KEY = "notes";
const TODOS_STORAGE_KEY = "todos";

export const storage = {
  // Notes operations
  getNotes: (): Note[] => {
    const notes = localStorage.getItem(NOTES_STORAGE_KEY);
    return notes ? JSON.parse(notes).map((note: Note) => ({
      ...note,
      images: note.images || [] // Ensure images array exists
    })) : [];
  },

  createNote: (note: CreateNote): Note => {
    const notes = storage.getNotes();
    const timestamp = Date.now();

    const newNote: Note = {
      id: nanoid(),
      ...note,
      images: note.images || [], // Ensure images array exists
      createdAt: timestamp,
      updatedAt: timestamp
    };

    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify([newNote, ...notes]));
    return newNote;
  },

  updateNote: (id: string, note: CreateNote): Note => {
    const notes = storage.getNotes();
    const existingNote = notes.find(n => n.id === id);
    const updatedNote: Note = {
      id,
      ...note,
      images: note.images || [], // Ensure images array exists
      createdAt: existingNote?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    localStorage.setItem(
      NOTES_STORAGE_KEY,
      JSON.stringify(notes.map(n => n.id === id ? updatedNote : n))
    );

    return updatedNote;
  },

  deleteNote: (id: string): void => {
    const notes = storage.getNotes();
    localStorage.setItem(
      NOTES_STORAGE_KEY,
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
  },

  // Todos operations
  getTodos: (): Todo[] => {
    const todos = localStorage.getItem(TODOS_STORAGE_KEY);
    return todos ? JSON.parse(todos).map((todo: Todo) => ({
      ...todo,
      images: todo.images || [] // Ensure images array exists
    })) : [];
  },

  createTodo: (todo: CreateTodo): Todo => {
    const todos = storage.getTodos();
    const timestamp = Date.now();

    const newTodo: Todo = {
      id: nanoid(),
      ...todo,
      images: todo.images || [], // Ensure images array exists
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify([newTodo, ...todos]));
    return newTodo;
  },

  updateTodo: (id: string, updates: Partial<Todo>): Todo => {
    const todos = storage.getTodos();
    const existingTodo = todos.find(t => t.id === id);
    if (!existingTodo) throw new Error("Todo not found");

    const updatedTodo: Todo = {
      ...existingTodo,
      ...updates,
      images: updates.images || existingTodo.images || [], // Ensure images array exists
      id,
      updatedAt: Date.now()
    };

    localStorage.setItem(
      TODOS_STORAGE_KEY,
      JSON.stringify(todos.map(t => t.id === id ? updatedTodo : t))
    );

    return updatedTodo;
  },

  deleteTodo: (id: string): void => {
    const todos = storage.getTodos();
    localStorage.setItem(
      TODOS_STORAGE_KEY,
      JSON.stringify(todos.filter(todo => todo.id !== id))
    );
  },

  toggleTodo: (id: string): Todo => {
    const todos = storage.getTodos();
    const todo = todos.find(t => t.id === id);
    if (!todo) throw new Error("Todo not found");

    return storage.updateTodo(id, { completed: !todo.completed });
  },

  searchTodos: (query: string): Todo[] => {
    const todos = storage.getTodos();
    const searchTerm = query.toLowerCase();

    return todos.filter(todo => 
      todo.title.toLowerCase().includes(searchTerm)
    );
  }
};