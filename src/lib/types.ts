import { Timestamp } from "firebase/firestore";

export type User = 'cipa' | 'jojo';

export interface Question {
  id: string;
  question: string;
  answer: string;
  isAnswered: boolean;
  sender: User;
  recipient: User;
  createdAt: Timestamp;
}
