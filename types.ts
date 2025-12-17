export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface ImageAttachment {
  mimeType: string;
  data: string; // Base64 encoded data
}

export interface Message {
  id: string;
  role: Role;
  text?: string;
  images?: ImageAttachment[];
  timestamp: number;
}

export interface GenerationConfig {
  aspectRatio?: string;
}
