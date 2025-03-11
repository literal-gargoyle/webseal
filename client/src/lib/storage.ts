import { Note, CreateNote, Todo, CreateTodo } from "@shared/schema";
import { nanoid } from "nanoid";

const NOTES_STORAGE_KEY = "notes";
const TODOS_STORAGE_KEY = "todos";

export const storage = {
  // Notes operations
  getNotes: (): Note[] => {
    const notes = localStorage.getItem(NOTES_STORAGE_KEY);
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

    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify([newNote, ...notes]));
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
    return todos ? JSON.parse(todos) : [];
  },

  createTodo: (todo: CreateTodo): Todo => {
    const todos = storage.getTodos();
    const timestamp = Date.now();

    const newTodo: Todo = {
      id: nanoid(),
      ...todo,
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