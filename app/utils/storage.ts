/* tslint:disable:no-any */
import path from 'path';
import fs from 'fs-extra';

class Storage {
  private readonly storagePath: string;

  constructor(pathToStorage: string) {
    this.storagePath = path.resolve(pathToStorage);
  }

  async get<T>(key: string): Promise<T> {
    try {
      const json = await this.getAll();
      return json[key];
    } catch (error) {
      throw new Error('Error while reading from storage!');
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      const isStorageExists = await fs.pathExists(this.storagePath);
      if (!isStorageExists) await fs.outputJson(this.storagePath, {});
      const json = await this.getAll();
      await fs.writeJson(this.storagePath, {
        ...json,
        [key]: value
      });
    } catch (error) {
      throw new Error('Error while saving to storage!');
    }
  }

  private async getAll(): Promise<any> {
    try {
      return await fs.readJson(this.storagePath);
    } catch (error) {
      throw new Error('Error while reading from storage!');
    }
  }
}

export const storage = new Storage('./dist/storage.json');
