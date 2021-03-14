import { DataService } from "./_types";
import { InMemoryDataService } from "./StorageService";

describe("InMemoryDataService", () => {
  let service: DataService;
  beforeAll(() => {
    service = new InMemoryDataService();
  });

  describe("list", () => {
    let listService: DataService;

    beforeEach(() => {
      listService = new InMemoryDataService();
    });

    it("normal case", async () => {
      const key = "key";
      const value = "value";
      await listService.save(key, value);

      const output = await listService.list();

      expect(output.length).toEqual(1);
      expect(output[0]).toEqual(value);
    });
    it("empty list", async () => {
      const output = await listService.list();

      expect(output.length === 0).toBeTruthy();
    });
  });
  describe("fetch", () => {
    it("normal case", async () => {
      const key = "key";
      const value = "value";
      await service.save(key, value);

      const output = await service.fetch(key);

      expect(output).toEqual(value);
    });
    it("key not defined", async () => {
      const key = "key";
      const value = "value";
      await service.save(key, value);

      await expect(service.fetch(""))
        .rejects
        .toThrow("key not specified.");
    });
    it("key not found", async () => {
      const key = "key";
      const value = "value";
      await service.save(key, value);

      const output = await service.fetch("other key");

      expect(output).toBeNull();
    });
  });

  describe("save", () => {
    it("normal case", async () => {
      const key = "key";
      const value = "value";

      await service.save(key, value);

      const output = await service.fetch(key);
      expect(output).toEqual(value);
    });
    it("key not defined", async () => {
      const key = "";
      const value = "value";

      await expect(service.save(key, value))
        .rejects
        .toThrow("key not specified.");
    });
    it("value not defined", async () => {
      const key = "key";
      const value: unknown | null = null;

      await service.save(key, value);

      const output = await service.fetch(key);
      expect(output).toEqual(value);
    });
    it("overwrites key if already populated", async () => {
      const key = "key";
      const value = "old value";

      await service.save(key, value);

      const newValue = "new value"
      await service.save(key, newValue);

      const output = await service.fetch(key);
      expect(output).toEqual(newValue);
    });
  });
  describe("delete", () => {
    it("normal case", async () => {
      const key = "key";
      const value = "value";
      await service.save(key, value);

      service.delete(key);

      const output = await service.fetch(key);
      expect(output).toBeNull();
    });
    it("key not defined", async () => {
      const key = "";

      await expect(service.delete(key))
        .rejects
        .toThrow("key not specified.");
    });
    it("no error if deleting non-existent key", async () => {
      const key = "key";

      service.delete(key);

      const output = await service.fetch(key);
      expect(output).toBeNull();
    });
  });
});