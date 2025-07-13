import { prisma } from './prisma';
import type { Article, Category, User, UserPreferences } from '../generated/prisma';

// Article operations
export const getArticles = async () => {
  return await prisma.article.findMany({
    where: { isActive: true, isPublished: true },
    include: { category: true },
    orderBy: { order: 'asc' },
  });
};

export const getArticleBySlug = async (slug: string) => {
  return await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });
};

// Category operations
export const getCategories = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    include: { articles: { where: { isActive: true, isPublished: true } } },
    orderBy: { order: 'asc' },
  });
};

export const getCategoryBySlug = async (slug: string) => {
  return await prisma.category.findUnique({
    where: { slug },
    include: { articles: { where: { isActive: true, isPublished: true } } },
  });
};

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
  eventData?: any;
  userAgent?: string;
  ipAddress?: string;
}) => {
  return await prisma.analyticsEvent.create({
    data: {
      userId: data.userId,
      sessionId: data.sessionId,
      eventType: data.eventType,
      eventData: data.eventData,
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