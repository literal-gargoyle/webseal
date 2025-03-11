import { useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { TodoDialog } from "./todo-dialog";
import type { Todo } from "@shared/schema";

interface TodoCardProps {
  todo: Todo;
  onUpdate: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

export function TodoCard({ todo, onUpdate, onDelete, onToggle }: TodoCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <Card className={`flex flex-col ${todo.completed ? 'opacity-75' : ''}`}>
        <CardHeader>
          <CardTitle className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={todo.completed}
                onCheckedChange={onToggle}
                className="mt-1"
              />
              <span className={`leading-tight ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                {todo.title}
              </span>
            </div>
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
                    <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this todo? This action cannot be undone.
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
        {todo.images && todo.images.length > 0 && (
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {todo.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Todo image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
              ))}
            </div>
          </CardContent>
        )}
        <CardFooter className="text-sm text-muted-foreground">
          Last updated {format(todo.updatedAt, "PPp")}
        </CardFooter>
      </Card>

      <TodoDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={onUpdate}
        todo={todo}
      />
    </>
  );
}