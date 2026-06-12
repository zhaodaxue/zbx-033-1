export interface LostItem {
  id: string;
  title: string;
  description: string;
  floor: number;
  contactTail: string;
  postDate: string;
  isClaimed: boolean;
  createdAt?: number;
}
