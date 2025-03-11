import { useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { NoteDialog } from "./note-dialog";
import type { Note } from "@shared/schema";

interface NoteCardProps {
  note: Note;
  onUpdate: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-start gap-2">
            <span className="leading-tight">{note.title}</span>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this note? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {note.content}
            </ReactMarkdown>
          </div>
          {note.images && note.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {note.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Note image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Last updated {format(note.updatedAt, "PPp")}
        </CardFooter>
      </Card>

      <NoteDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={onUpdate}
        note={note}
      />
    </>
  );
}