export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TransferDetails {
  amount: number;
  fromAccount: string;
  toAccount: string;
  description?: string;
}