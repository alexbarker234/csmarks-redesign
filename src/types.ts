export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Assessment {
  name: string;
  mark?: number;
  maxMark: number;
}

export interface Unit {
  unitCode: string;
  unitName: string;
  overall: string;
  assessments: Assessment[];
}

export type Forum = {
  id: number;
  name: string;
  description: string;
};
export type Reply = {
  timestamp: Date;
  author: string;
  likes: number;
};

export type ReplyDetails = {
  timestamp: Date;
  author: string;
  likes: number;
  content: string;
};

export type Post<T extends Reply | ReplyDetails> = {
  id: number;
  title: string;
  likes: number;
  tags: string[];
  replies: T[];
};
