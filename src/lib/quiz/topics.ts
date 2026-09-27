export function parseQuizTopics(params: Pick<URLSearchParams, 'getAll'>): string[] {
  return [...new Set(params.getAll('topic').flatMap((value) => value.split(',').filter(Boolean)))];
}
