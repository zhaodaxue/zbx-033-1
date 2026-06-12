import { create } from 'zustand';
import type { LostItem } from '../types';
import { seedData } from '../data/seedData';
import { sortByDateDesc } from '../utils/filter';

interface LostItemState {
  items: LostItem[];
  selectedFloors: number[];
  onlyUnclaimed: boolean;
  expandedItemId: string | null;
  toggleFloor: (floor: number) => void;
  setOnlyUnclaimed: (value: boolean) => void;
  toggleExpand: (id: string) => void;
  markAsClaimed: (id: string) => void;
  getSortedItems: () => LostItem[];
}

export const useLostItemStore = create<LostItemState>((set, get) => ({
  items: seedData,
  selectedFloors: [],
  onlyUnclaimed: false,
  expandedItemId: null,

  toggleFloor: (floor: number) =>
    set((state) => {
      const hasFloor = state.selectedFloors.includes(floor);
      return {
        selectedFloors: hasFloor
          ? state.selectedFloors.filter((f) => f !== floor)
          : [...state.selectedFloors, floor],
      };
    }),

  setOnlyUnclaimed: (value: boolean) => set({ onlyUnclaimed: value }),

  toggleExpand: (id: string) =>
    set((state) => ({
      expandedItemId: state.expandedItemId === id ? null : id,
    })),

  markAsClaimed: (id: string) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isClaimed: true } : item,
      ),
    })),

  getSortedItems: () => sortByDateDesc(get().items),
}));
