import type { LostItem } from '../types';

export function filterByFloors(items: LostItem[], floors: number[]): LostItem[] {
  if (floors.length === 0) return items;
  return items.filter((item) => floors.includes(item.floor));
}

export function filterUnclaimed(items: LostItem[]): LostItem[] {
  return items.filter((item) => !item.isClaimed);
}

export function sortByDateDesc(items: LostItem[]): LostItem[] {
  return [...items].sort((a, b) => {
    const [ay, am, ad] = a.postDate.split('-').map(Number);
    const [by, bm, bd] = b.postDate.split('-').map(Number);
    const aTime = new Date(ay, am - 1, ad).getTime();
    const bTime = new Date(by, bm - 1, bd).getTime();
    if (bTime !== aTime) return bTime - aTime;
    const aCreated = a.createdAt ?? 0;
    const bCreated = b.createdAt ?? 0;
    if (aCreated !== bCreated) return bCreated - aCreated;
    return 0;
  });
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
