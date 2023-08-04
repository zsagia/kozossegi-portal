export interface Messages {
  id: number;
  senderId: number;
  receiverId: number | null;
  timestamp: Date;
  text: string;
}
