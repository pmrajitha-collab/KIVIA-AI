export type UserStatus = 'online' | 'busy' | 'studying' | 'offline';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  currentFocus?: string;
  password?: string;
  email?: string;
  academicLevel?: string;
  classLevel?: string;
  division?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  timestamp: string;
  likes: string[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type: 'text' | 'voice' | 'file' | 'ai';
  status?: 'sent' | 'delivered' | 'read';
  metadata?: {
    groupId: string;
    fileUrl?: string;
    fileName?: string;
    duration?: number;
    preview?: {
      type: 'image' | 'video' | 'website' | 'file';
      url: string;
      title?: string;
    };
  };
}

export interface Alarm {
  id: string;
  time: string;
  label: string;
  isEnabled: boolean;
  days: number[]; // 0-6
}

export interface PlannerTask {
  id: string;
  title: string;
  day: number;
  time: string;
  category: 'study' | 'break' | 'review';
}

export interface ScheduledSession {
  id: string;
  groupId: string;
  title: string;
  startTime: string;
  duration: number;
}

export interface StudyRoutine {
  id: string;
  groupId: string;
  label: string;
  dayOfWeek: number;
  time: string;
}

export interface Group {
  id: string;
  name: string;
  avatar?: string;
  joinCode: string;
  memberIds: string[];
  adminIds: string[];
  lastMessage?: string;
  createdAt: string;
  activeCallId?: string | null;
}

export interface NoteSource {
  type: 'chat' | 'video' | 'document';
  id: string;
  title: string;
}

export interface SmartNote {
  id: string;
  groupId: string;
  title: string;
  content: string;
  source: NoteSource;
  tags: string[];
  createdAt: string;
}

export interface Flashcard {
  id: string;
  groupId: string;
  term: string;
  definition: string;
  tags: string[];
  lastStudied?: string;
}

export interface VideoSession {
  id: string;
  groupId: string;
  title: string;
  thumbnail: string;
  duration: string;
  recordedAt: string;
  url: string;
  sharedByName: string;
  summary: string;
  transcript?: string;
}

export enum AppTab {
  HOME = 'home',
  CHAT = 'chat',
  VIDEO = 'video',
  NOTEBOOK = 'notebook',
  FLASHCARDS = 'flashcards',
  FLASHCARD_GEN = 'flashcard_gen',
  AI_CHAT = 'ai_chat',
  SCHEDULE = 'schedule',
  GROUPS_HUB = 'groups_hub',
  PROFILE_HUB = 'profile_hub',
  PLANNER = 'planner',
  GROUP_SETTINGS = 'group_settings'
}