import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface LLMConfig {
  provider: 'gemini' | 'perplexity';
  apiKey: string;
  model?: string;
  maxRetries?: number;
  delayBetweenRequests?: number;
}

export interface CypherGenConfig {
  outputPath: string;
  batchSize?: number;
  enableLogging?: boolean;
  validateQueries?: boolean;
}

// Default configuration
export const defaultLLMConfig: LLMConfig = {
  provider: 'gemini',
  apiKey: process.env.GEMINI_API_KEY || process.env.PERPLEXITY_API_KEY || '',
  maxRetries: 3,
  delayBetweenRequests: 1000, // 1 second delay between API calls
};

export const defaultCypherGenConfig: CypherGenConfig = {
  outputPath: './neo4j/graphSeedData3.ts',
  batchSize: 5, // Process 5 people at a time
  enableLogging: true,
  validateQueries: true,
};

// Helper function to get configuration from environment
export function getConfigFromEnv(): LLMConfig {
  const geminiKey = process.env.GEMINI_API_KEY;
  const perplexityKey = process.env.PERPLEXITY_API_KEY;

  if (geminiKey) {
    return {
      provider: 'gemini',
      apiKey: geminiKey,
      model: 'gemini-1.5-flash',
      maxRetries: 3,
      delayBetweenRequests: 1000,
    };
  }

  if (perplexityKey) {
    return {
      provider: 'perplexity',
      apiKey: perplexityKey,
      model: 'llama-3.1-sonar-small-128k-online',
      maxRetries: 3,
      delayBetweenRequests: 1000,
    };
  }

  throw new Error('No API key found. Please set GEMINI_API_KEY or PERPLEXITY_API_KEY environment variable.');
}

// Validation function
export function validateConfig(config: LLMConfig): boolean {
  if (!config.apiKey) {
    throw new Error('API key is required');
  }

  if (!['gemini', 'perplexity'].includes(config.provider)) {
    throw new Error('Provider must be either "gemini" or "perplexity"');
  }

  if (config.maxRetries && config.maxRetries < 0) {
    throw new Error('maxRetries must be non-negative');
  }

  if (config.delayBetweenRequests && config.delayBetweenRequests < 0) {
    throw new Error('delayBetweenRequests must be non-negative');
  }

  return true;
}
