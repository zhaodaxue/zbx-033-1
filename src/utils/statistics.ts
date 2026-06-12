import type { LostItem } from '../types';

export function countUnclaimed(items: LostItem[]): number {
  return items.filter((item) => !item.isClaimed).length;
}

export function countNewThisWeek(items: LostItem[]): number {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  return items.filter((item) => {
    const postDate = new Date(item.postDate);
    return postDate >= sevenDaysAgo && postDate <= now;
  }).length;
}

export function countFloors(items: LostItem[]): number {
  const floors = new Set(items.map((item) => item.floor));
  return floors.size;
}

export function getAllFloors(items: LostItem[]): number[] {
  const floors = new Set(items.map((item) => item.floor));
  return Array.from(floors).sort((a, b) => a - b);
}

export interface Stats {
  unclaimedCount: number;
  newThisWeekCount: number;
  floorsCount: number;
}

export function computeStats(items: LostItem[]): Stats {
  return {
    unclaimedCount: countUnclaimed(items),
    newThisWeekCount: countNewThisWeek(items),
    floorsCount: countFloors(items),
  };
}
