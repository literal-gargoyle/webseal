import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/notes/note-card";
import { NoteDialog } from "@/components/notes/note-dialog";
import { TodoCard } from "@/components/todos/todo-card";
import { TodoDialog } from "@/components/todos/todo-dialog";
import { SearchBar } from "@/components/notes/search-bar";
import { storage } from "@/lib/storage";
import { settings } from "@/lib/settings";
import type { Note, Todo } from "@shared/schema";

export default function Home() {
  // Initialize with empty arrays to avoid hydration errors
  const [notes, setNotes] = useState<Note[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();
  const [mode, setMode] = useState<'notes' | 'todos'>('notes');

  // Load data after component mounts
  useEffect(() => {
    setNotes(storage.getNotes());
    setTodos(storage.getTodos());
    setMode(settings.get().mode);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (mode === 'notes') {
      setNotes(query ? storage.searchNotes(query) : storage.getNotes());
    } else {
      setTodos(query ? storage.searchTodos(query) : storage.getTodos());
    }
  };

  const handleNoteCreate = () => {
    setIsCreateOpen(false);
    setNotes(storage.getNotes());
    toast({
      title: "Note created",
      description: "Your note has been created successfully."
    });
  };

  const handleNoteUpdate = () => {
    setNotes(storage.getNotes());
    toast({
      title: "Note updated",
      description: "Your note has been updated successfully."
    });
  };

  const handleNoteDelete = (id: string) => {
    storage.deleteNote(id);
    setNotes(storage.getNotes());
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully.",
      variant: "destructive"
    });
  };

  const handleTodoCreate = () => {
    setIsCreateOpen(false);
    setTodos(storage.getTodos());
    toast({
      title: "Todo created",
      description: "Your todo has been created successfully."
    });
  };

  const handleTodoUpdate = () => {
    setTodos(storage.getTodos());
    toast({
      title: "Todo updated",
      description: "Your todo has been updated successfully."
    });
  };

  const handleTodoDelete = (id: string) => {
    storage.deleteTodo(id);
    setTodos(storage.getTodos());
    toast({
      title: "Todo deleted",
      description: "Your todo has been deleted successfully.",
      variant: "destructive"
    });
  };

  const handleTodoToggle = (id: string) => {
    storage.toggleTodo(id);
    setTodos(storage.getTodos());
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {mode === 'notes' ? 'My Notes' : 'My Todos'}
          </h1>
          <Button onClick={() => setIsCreateOpen(true)} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            New {mode === 'notes' ? 'Note' : 'Todo'}
          </Button>
        </div>

        <SearchBar 
          value={searchQuery} 
          onChange={handleSearch}
          placeholder={`Search ${mode === 'notes' ? 'notes' : 'todos'}...`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mode === 'notes' ? (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={handleNoteUpdate}
                onDelete={() => handleNoteDelete(note.id)}
              />
            ))
          ) : (
            todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onUpdate={handleTodoUpdate}
                onDelete={() => handleTodoDelete(todo.id)}
                onToggle={() => handleTodoToggle(todo.id)}
              />
            ))
          )}
          {(mode === 'notes' ? notes.length === 0 : todos.length === 0) && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {searchQuery ? 
                `No ${mode === 'notes' ? 'notes' : 'todos'} found matching your search` : 
                `No ${mode === 'notes' ? 'notes' : 'todos'} yet. Create your first ${mode === 'notes' ? 'note' : 'todo'}!`
              }
            </div>
          )}
        </div>
      </div>

      {mode === 'notes' ? (
        <NoteDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSave={handleNoteCreate}
        />
      ) : (
        <TodoDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSave={handleTodoCreate}
        />
      )}
    </div>
  );
}