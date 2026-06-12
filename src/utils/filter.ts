import type { LostItem } from '../types';

export function filterByFloors(items: LostItem[], floors: number[]): LostItem[] {
  if (floors.length === 0) return items;
  return items.filter((item) => floors.includes(item.floor));
}

export function filterUnclaimed(items: LostItem[]): LostItem[] {
  return items.filter((item) => !item.isClaimed);
}

export function sortByDateDesc(items: LostItem[]): LostItem[] {
  return [...items].sort(
    (a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime(),
  );
}

export function applyFilters(
  items: LostItem[],
  options: {
    selectedFloors: number[];
    onlyUnclaimed: boolean;
  },
): LostItem[] {
  let result = items;

  if (options.selectedFloors.length > 0) {
    result = filterByFloors(result, options.selectedFloors);
  }

  if (options.onlyUnclaimed) {
    result = filterUnclaimed(result);
  }

  return sortByDateDesc(result);
}
