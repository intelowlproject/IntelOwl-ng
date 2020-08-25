import { Injectable } from '@angular/core';
import { DexieService } from './dexie.service';
import { IRecentScan } from '../models/models';

@Injectable()
export class IndexedDbService {
  tables: string[] = ['recent_scans'];

  constructor(private dexieService: DexieService) {}

  async getOne(tableName: string, key: string | number) {
    return await this.dexieService.table(tableName).get(key);
  }

  async getRecentScans(): Promise<IRecentScan[]> {
    return await this.dexieService.table('recent_scans').toArray();
  }

  async addToRecentScans(obj: IRecentScan) {
    const table = this.dexieService.table('recent_scans');
    if ((await table.count()) >= 10) {
      // at a time, there shouldn't be more than 10 entries
      table.limit(3).delete();
    }
    await table.put(obj);
  }

  async addOrReplaceOne(tableName: string, obj: any, forceUpdate?: boolean) {
    if (this.tables.indexOf(tableName) < 0) {
      return;
    }
    try {
      if (forceUpdate) {
        await this.dexieService.table(tableName).put(obj, obj.id);
        return;
      }
      const res = await this.dexieService.table(tableName).get(obj.id);
      if (!res) {
        await this.dexieService.table(tableName).add(obj);
      } else {
        await this.dexieService.table(tableName).update(obj.id, obj);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async addOrReplaceBulk(tableName: string, arr: any[]) {
    if (this.tables.indexOf(tableName) < 0) {
      return;
    }
    try {
      await this.dexieService.table(tableName).bulkPut(arr);
    } catch (e) {
      console.error(e);
    }
  }

  getAllInstances(tableName: string) {
    return this.dexieService.table(tableName).toArray();
  }

  getTableInstance(tableName: string) {
    return this.dexieService.table(tableName);
  }
}
