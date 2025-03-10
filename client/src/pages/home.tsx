import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/notes/note-card";
import { NoteDialog } from "@/components/notes/note-dialog";
import { SearchBar } from "@/components/notes/search-bar";
import { storage } from "@/lib/storage";
import type { Note } from "@shared/schema";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(storage.getNotes());
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setNotes(storage.searchNotes(query));
    } else {
      setNotes(storage.getNotes());
    }
  };

  const handleCreate = () => {
    setIsCreateOpen(false);
    setNotes(storage.getNotes());
    toast({
      title: "Note created",
      description: "Your note has been created successfully."
    });
  };

  const handleUpdate = () => {
    setNotes(storage.getNotes());
    toast({
      title: "Note updated",
      description: "Your note has been updated successfully."
    });
  };

  const handleDelete = (id: string) => {
    storage.deleteNote(id);
    setNotes(storage.getNotes());
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully.",
      variant: "destructive"
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Notes
          </h1>
          <Button onClick={() => setIsCreateOpen(true)} size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Note
          </Button>
        </div>

        <SearchBar value={searchQuery} onChange={handleSearch} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={handleUpdate}
              onDelete={() => handleDelete(note.id)}
            />
          ))}
          {notes.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {searchQuery ? "No notes found matching your search" : "No notes yet. Create your first note!"}
            </div>
          )}
        </div>
      </div>

      <NoteDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSave={handleCreate}
      />
    </div>
  );
}
