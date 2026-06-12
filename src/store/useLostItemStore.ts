import { create } from 'zustand';
import type { LostItem } from '../types';
import { seedData } from '../data/seedData';
import { sortByDateDesc } from '../utils/filter';

interface LostItemState {
  items: LostItem[];
  selectedFloors: number[];
  onlyUnclaimed: boolean;
  expandedItemId: string | null;
  supplementedIds: Set<string>;
  showForm: boolean;
  toggleFloor: (floor: number) => void;
  setOnlyUnclaimed: (value: boolean) => void;
  toggleExpand: (id: string) => void;
  markAsClaimed: (id: string) => void;
  getSortedItems: () => LostItem[];
  addItem: (item: Omit<LostItem, 'id' | 'postDate' | 'isClaimed' | 'createdAt'>) => string;
  setShowForm: (show: boolean) => void;
  relaxFilters: () => void;
  getHiddenSupplementCount: () => number;
}

export const useLostItemStore = create<LostItemState>((set, get) => ({
  items: seedData,
  selectedFloors: [],
  onlyUnclaimed: false,
  expandedItemId: null,
  supplementedIds: new Set<string>(),
  showForm: false,

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

  addItem: (input) => {
    const id = `sup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date();
    const postDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newItem: LostItem = {
      id,
      title: input.title,
      description: input.description || '',
      floor: input.floor,
      contactTail: input.contactTail,
      postDate,
      isClaimed: false,
      createdAt: Date.now(),
    };

    set((state) => ({
      items: [newItem, ...state.items],
      expandedItemId: id,
      supplementedIds: new Set([...state.supplementedIds, id]),
      showForm: false,
    }));

    return id;
  },

  setShowForm: (show: boolean) => set({ showForm: show }),

  relaxFilters: () => {
    const state = get();
    const newSelectedFloors = [...state.selectedFloors];
    let newOnlyUnclaimed = state.onlyUnclaimed;

    const supplementedItems = state.items.filter((item) =>
      state.supplementedIds.has(item.id),
    );

    const hiddenSupplements = supplementedItems.filter((item) => {
      if (state.onlyUnclaimed && item.isClaimed) return false;
      if (state.selectedFloors.length > 0 && !state.selectedFloors.includes(item.floor))
        return false;
      return true;
    });

    const isHiddenByFloor = supplementedItems.some(
      (item) => state.selectedFloors.length > 0 && !state.selectedFloors.includes(item.floor),
    );

    if (isHiddenByFloor) {
      const neededFloors = supplementedItems
        .filter((item) => !newSelectedFloors.includes(item.floor))
        .map((item) => item.floor);
      neededFloors.forEach((f) => newSelectedFloors.push(f));
    }

    if (hiddenSupplements.length === 0 && state.onlyUnclaimed) {
      newOnlyUnclaimed = false;
    }

    set({
      selectedFloors: newSelectedFloors,
      onlyUnclaimed: newOnlyUnclaimed,
    });
  },

  getHiddenSupplementCount: () => {
    const state = get();
    const supplementedItems = state.items.filter((item) =>
      state.supplementedIds.has(item.id),
    );

    return supplementedItems.filter((item) => {
      if (state.selectedFloors.length > 0 && !state.selectedFloors.includes(item.floor))
        return true;
      if (state.onlyUnclaimed && item.isClaimed) return true;
      return false;
    }).length;
  },
}));
