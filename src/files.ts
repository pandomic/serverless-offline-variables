import { existsSync, readFileSync } from 'fs';

export const readFileContent = (path: string): string | null => {
  if (!existsSync(path)) return null;

  return readFileSync(path).toString();
};
