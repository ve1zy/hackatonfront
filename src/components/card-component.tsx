"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useBoardStore, Card as CardType } from "@/store/board-store";

interface CardComponentProps {
  card: CardType;
}

export function CardComponent({ card }: CardComponentProps) {
  const { updateCard, deleteCard } = useBoardStore();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  const handleSave = () => {
    updateCard(card.id, { title, description });
  };

  const handleDelete = () => {
    if (confirm("Delete this card?")) {
      deleteCard(card.id);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {card.title}
            </CardTitle>
          </CardHeader>
          {card.description && (
            <CardContent>
              <CardDescription className="line-clamp-3 text-xs">
                {card.description}
              </CardDescription>
            </CardContent>
          )}
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>Edit card details and save changes</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={4}
          />
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">
                <X className="h-4 w-4" /> Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSave}>
              <Pencil className="h-4 w-4" /> Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}