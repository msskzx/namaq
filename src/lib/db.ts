import { prisma } from './prisma';
import type { UserPreferences } from '@/generated/prisma';

// User operations
export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    include: { preferences: true },
  });
};

export const createUser = async (email: string, name?: string) => {
  return await prisma.user.create({
    data: {
      email,
      name,
      preferences: {
        create: {
          analyticsEnabled: false,
          preferredLanguage: 'ar',
        },
      },
    },
    include: { preferences: true },
  });
};

export const updateUserPreferences = async (
  userId: string,
  preferences: Partial<UserPreferences>
) => {
  return await prisma.userPreferences.upsert({
    where: { userId },
    update: preferences,
    create: {
      userId,
      ...preferences,
    },
  });
};

// Analytics operations
export const createAnalyticsEvent = async (data: {
  userId?: string;
  sessionId: string;
  eventType: string;
  eventData?: Record<string, unknown>;
  userAgent?: string;
  ipAddress?: string;
}) => {
  return await prisma.analyticsEvent.create({
    data: {
      userId: data.userId,
      sessionId: data.sessionId,
      eventType: data.eventType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      eventData: data.eventData as any, // TODO: Fix type issue
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
    },
  });
};

// Progress tracking
export const getUserProgress = async (userId: string) => {
  return await prisma.userProgress.findMany({
    where: { userId },
    include: { article: true },
  });
};

export const updateUserProgress = async (
  userId: string,
  articleId: string,
  data: {
    completed?: boolean;
    timeSpent?: number;
  }
) => {
  return await prisma.userProgress.upsert({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
    update: {
      ...data,
      lastAccessed: new Date(),
      completedAt: data.completed ? new Date() : undefined,
    },
    create: {
      userId,
      articleId,
      ...data,
      lastAccessed: new Date(),
      completedAt: data.completed ? new Date() : undefined,
    },
  });
};

// People operations
export const getPeople = async () => {
  return await prisma.person.findMany({
    orderBy: { name: 'asc' },
  });
};

export const getPersonBySlug = async (slug: string) => {
  return await prisma.person.findUnique({
    where: { slug },
    include: {
      titles: true,
      relationsFrom: {
        include: { to: true },
      },
      relationsTo: {
        include: { from: true },
      },
      participations: {
        include: { battle: true },
      },
    },
  });
}; 