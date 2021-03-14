import { DataService } from "./_types";

export class InMemoryDataService implements DataService {
  private map: Map<string, unknown>;

  constructor() {
    this.map = new Map<string, unknown>();
  }

  list: DataService["list"] = async <T>() => {
    const arr = Array.from(this.map.values());
    return arr as T[];
  };

  fetch: DataService["fetch"] = async <T>(key: string) => {
    if (!key) throw new Error("key not specified.");

    const value = this.map.get(key);

    if (!value) return null;

    return value as T
  }
  save: DataService["save"] = async <T>(key: string, item: T) => {
    if (!key) throw new Error("key not specified.");

    this.map.set(key, item);
  }
  delete: DataService["delete"] = async (key: string) => {
    if (!key) throw new Error("key not specified.");

    this.map.delete(key);
  }
}