import type { LostItem } from '../types';

export function countUnclaimed(items: LostItem[]): number {
  return items.filter((item) => !item.isClaimed).length;
}

export function countNewThisWeek(items: LostItem[]): number {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgoStart = new Date(todayStart);
  sevenDaysAgoStart.setDate(todayStart.getDate() - 6);

  return items.filter((item) => {
    const [year, month, day] = item.postDate.split('-').map(Number);
    const postDateStart = new Date(year, month - 1, day);
    return postDateStart >= sevenDaysAgoStart && postDateStart <= todayStart;
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
