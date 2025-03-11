import { z } from "zod";

export const noteSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  createdAt: z.number(),
  updatedAt: z.number()
});

export type Note = z.infer<typeof noteSchema>;

export const createNoteSchema = noteSchema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
});

export type CreateNote = z.infer<typeof createNoteSchema>;

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().default(false),
  createdAt: z.number(),
  updatedAt: z.number()
});

export type Todo = z.infer<typeof todoSchema>;

export const createTodoSchema = todoSchema.omit({
  id: true,
  completed: true,
  createdAt: true,
  updatedAt: true
});

export type CreateTodo = z.infer<typeof createTodoSchema>;