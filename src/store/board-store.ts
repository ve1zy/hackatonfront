import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ColumnType = 'todo' | 'in-progress' | 'done';

export interface Card {
  id: string;
  title: string;
  description: string;
  column: ColumnType;
}

interface BoardState {
  columns: ColumnType[];
  cards: Card[];
  addCard: (card: Omit<Card, 'id'>) => void;
  updateCard: (id: string, card: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  moveCard: (id: string, column: ColumnType) => void;
  reorderCards: (column: ColumnType, cards: Card[]) => void;
  clearAllCards: () => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      columns: ['todo', 'in-progress', 'done'],
      cards: [],
      addCard: (card) =>
        set((state) => ({
          cards: [...state.cards, { ...card, id: crypto.randomUUID() }],
        })),
      updateCard: (id, card) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, ...card } : c)),
        })),
      deleteCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        })),
      moveCard: (id, column) =>
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, column } : c)),
        })),
      reorderCards: (column, orderedCards) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            orderedCards.find((oc) => oc.id === c.id) ? { ...c, column } : c
          ),
        })),
      clearAllCards: () => set({ cards: [] }),
    }),
    { name: 'notion-board-storage' }
  )
);