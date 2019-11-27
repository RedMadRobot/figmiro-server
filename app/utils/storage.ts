/* tslint:disable:no-any */
import path from 'path';
import fs from 'fs-extra';

class Storage {
  private readonly storagePath: string;

  constructor(pathToStorage: string) {
    this.storagePath = path.resolve(pathToStorage);
  }

  async get(key: string): Promise<any> {
    try {
      const json = await this.getAll();
      return json[key];
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<any> {
    try {
      return await fs.readJson(this.storagePath);
    } catch (error) {
      throw error;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      const isStorageExists = await fs.pathExists(this.storagePath);
      if (!isStorageExists) await fs.outputJson(this.storagePath, {});
      const json = await this.getAll();
      await fs.writeJson(this.storagePath, {
        ...json,
        [key]: value
      });
    } catch (error) {
      throw error;
    }
  }
}

export const storage = new Storage('./dist/storage.json');
