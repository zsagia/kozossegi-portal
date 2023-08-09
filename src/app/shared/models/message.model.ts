export interface UserMessage {
  id: number;
  fromUser: number;
  fromUserName?: string;
  toUser: number;
  message: string;
  timestamp: string;
}
