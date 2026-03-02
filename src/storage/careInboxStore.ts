import { Settings } from 'react-native';
import { CareResponseChannel, CareSupportCategoryId } from '../care/supportCategories';

const CARE_THREADS_KEY = 'mkp.care.threads';

export type CareThreadStatus = 'awaiting_reply' | 'replied' | 'closed';
export type CareMessageSender = 'member' | 'church';

export type CareMessage = {
  id: string;
  sender: CareMessageSender;
  body: string;
  createdAt: string;
};

export type CareThread = {
  id: string;
  churchId?: string;
  categoryId: CareSupportCategoryId;
  preferredChannel: CareResponseChannel;
  requestPreview: string;
  status: CareThreadStatus;
  maxChurchReplies: 1;
  churchReplyCount: number;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
  messages: CareMessage[];
};

const parseThreads = (raw: unknown): CareThread[] => {
  if (typeof raw !== 'string' || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item === 'object') as CareThread[];
  } catch {
    return [];
  }
};

const saveThreads = (threads: CareThread[]) => {
  Settings.set({ [CARE_THREADS_KEY]: JSON.stringify(threads) });
};

export const getCareThreads = (): CareThread[] => {
  const raw = Settings.get(CARE_THREADS_KEY);
  return parseThreads(raw).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

export const getCareThreadById = (threadId: string): CareThread | null =>
  getCareThreads().find((thread) => thread.id === threadId) || null;

export const createCareSupportThread = ({
  categoryId,
  preferredChannel,
  requestText,
  churchId,
}: {
  categoryId: CareSupportCategoryId;
  preferredChannel: CareResponseChannel;
  requestText: string;
  churchId?: string;
}): CareThread => {
  const now = new Date().toISOString();
  const thread: CareThread = {
    id: `care-thread-${Date.now()}`,
    churchId,
    categoryId,
    preferredChannel,
    requestPreview: requestText,
    status: 'awaiting_reply',
    maxChurchReplies: 1,
    churchReplyCount: 0,
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `care-message-${Date.now()}`,
        sender: 'member',
        body: requestText,
        createdAt: now,
      },
    ],
  };

  const next = [thread, ...getCareThreads()];
  saveThreads(next);
  return thread;
};

export const addChurchReplyToThread = ({
  threadId,
  body,
}: {
  threadId: string;
  body: string;
}): CareThread | null => {
  const threads = getCareThreads();
  let updatedThread: CareThread | null = null;

  const next = threads.map((thread) => {
    if (thread.id !== threadId) return thread;
    if (thread.churchReplyCount >= thread.maxChurchReplies) {
      updatedThread = thread;
      return thread;
    }

    const updated: CareThread = {
      ...thread,
      churchReplyCount: thread.churchReplyCount + 1,
      status: 'closed',
      updatedAt: new Date().toISOString(),
      messages: [
        ...thread.messages,
        {
          id: `care-message-${Date.now()}`,
          sender: 'church',
          body,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    updatedThread = updated;
    return updated;
  });

  saveThreads(next);
  return updatedThread;
};

export const markCareThreadRead = (threadId: string) => {
  const threads = getCareThreads();
  const next = threads.map((thread) =>
    thread.id === threadId ? { ...thread, readAt: new Date().toISOString() } : thread
  );
  saveThreads(next);
};
