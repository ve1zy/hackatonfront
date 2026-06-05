"use client";

import { CardComponent } from "./card-component";
import { Card as CardType } from "@/store/board-store";
import { Droppable, Draggable } from "@hello-pangea/dnd";

interface ColumnProps {
  column: string;
  cards: CardType[];
}

export function Column({ column, cards }: ColumnProps) {
  return (
    <div className="flex w-80 flex-col rounded-lg bg-zinc-200 p-3 dark:bg-zinc-800">
      <h2 className="mb-3 text-lg font-semibold capitalize">{column}</h2>
      <Droppable droppableId={column} type="CARD">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-2"
          >
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <CardComponent card={card} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}