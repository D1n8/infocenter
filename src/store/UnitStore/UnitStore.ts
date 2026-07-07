import { api } from 'config/api';
import { makeAutoObservable, runInAction } from 'mobx';
import type { LevelType, UnitTreeItem, UnitUpdateSchema } from 'types/index';

export default class UnitStore {
  isLoading = false;
  error = '';
  unitsTree: UnitTreeItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchUnitsTree() {
    this.isLoading = true;
    this.error = '';
    try {
      const response = await api.get<UnitTreeItem[]>('/units/tree');
      runInAction(() => {
        this.unitsTree = response.data;
      });
    } catch {
      runInAction(() => {
        this.error = 'Не удалось загрузить структуру предприятия';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createUnit(name: string, levelType: LevelType, parentId: string | null) {
    this.isLoading = true;
    this.error = '';
    try {
      await api.post('/units/', null, {
        params: {
          name,
          level_type: levelType,
          parent_id: parentId || undefined,
        },
      });
      await this.fetchUnitsTree();
    } catch {
      runInAction(() => {
        this.error = 'Не удалось создать подразделение';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async updateUnit(unitId: string, name: string) {
    this.isLoading = true;
    this.error = '';
    try {
      const payload: UnitUpdateSchema = { name };
      await api.patch(`/units/${unitId}`, payload);
      await this.fetchUnitsTree();
    } catch {
      runInAction(() => {
        this.error = 'Не удалось обновить подразделение';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async deleteUnit(unitId: string) {
    this.isLoading = true;
    this.error = '';
    try {
      await api.delete(`/units/${unitId}`);
      await this.fetchUnitsTree();
    } catch {
      runInAction(() => {
        this.error = 'Не удалось удалить подразделение';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}
