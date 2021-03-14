
export interface DataService {
  list: <T>() => Promise<T[]>;
  fetch: <T>(key: string) => Promise<T | null>;
  save: <T>(key: string, item: T) => Promise<void>;
  delete: (key: string) => Promise<void>;
}