import { api } from 'config/api';
import { computed, makeObservable, observable, runInAction } from 'mobx';
import type { BlockType } from 'types/index';

import type { DatasetResponse, DatasetCreate, ChartResponse, ChartCreate } from '../models/diagram';

type PrivateFields = '_error' | '_isLoading' | '_diagrams' | '_currentDiagram' | '_charts';

export default class DiagramStore {
  private _error = '';
  private _isLoading = false;
  private _diagrams: DatasetResponse[] = [];
  private _currentDiagram: DatasetResponse | null = null;
  private _charts: ChartResponse[] = [];

  constructor() {
    makeObservable<DiagramStore, PrivateFields>(this, {
      _error: observable,
      _isLoading: observable,
      _diagrams: observable,
      _currentDiagram: observable,
      _charts: observable,

      error: computed,
      isLoading: computed,
      diagrams: computed,
      currentDiagram: computed,
      charts: computed,
    });
  }

  get error(): string {
    return this._error;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get diagrams(): DatasetResponse[] {
    return this._diagrams;
  }

  get currentDiagram(): DatasetResponse | null {
    return this._currentDiagram;
  }

  get charts(): ChartResponse[] {
    return this._charts;
  }

  async fetchDiagrams(skip = 0, limit = 100, block?: BlockType | null, unitId?: string | null) {
    this._isLoading = true;
    this._error = '';
    try {
      const response = await api.get<DatasetResponse[]>('/diagrams/', {
        params: {
          skip,
          limit,
          block: block || undefined,
          unit_id: unitId || undefined,
        },
      });
      runInAction(() => {
        this._diagrams = response.data;
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось загрузить список диаграмм';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async fetchDiagramById(diagramId: string) {
    this._isLoading = true;
    this._error = '';
    try {
      const response = await api.get<DatasetResponse>(`/diagrams/${diagramId}`);
      runInAction(() => {
        this._currentDiagram = response.data;
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось загрузить диаграмму';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async fetchDashboardData(block?: BlockType | null) {
    this._isLoading = true;
    this._error = '';
    try {
      const [diagramsResponse, chartsResponse] = await Promise.all([
        api.get<DatasetResponse[]>('/diagrams/', {
          params: {
            skip: 0,
            limit: 100,
            block: block || undefined,
          },
        }),
        api.get<ChartResponse[]>('/charts/'),
      ]);

      runInAction(() => {
        this._diagrams = diagramsResponse.data;
        this._charts = chartsResponse.data;
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось загрузить данные дашборда';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async createDiagram(data: DatasetCreate): Promise<DatasetResponse | null> {
    this._isLoading = true;
    this._error = '';
    try {
      const response = await api.post<DatasetResponse>('/diagrams/', data);
      runInAction(() => {
        this._diagrams.push(response.data);
      });
      return response.data;
    } catch {
      runInAction(() => {
        this._error = 'Не удалось создать диаграмму';
      });
      return null;
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async updateDiagram(diagramId: string, data: Partial<DatasetCreate>) {
    this._isLoading = true;
    this._error = '';
    try {
      const response = await api.patch<DatasetResponse>(`/diagrams/${diagramId}`, data);
      runInAction(() => {
        this._diagrams = this._diagrams.map((d) => (d.id === diagramId ? response.data : d));
        if (this._currentDiagram?.id === diagramId) {
          this._currentDiagram = response.data;
        }
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось обновить диаграмму';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async deleteDiagram(diagramId: string) {
    this._isLoading = true;
    this._error = '';
    try {
      await api.delete(`/diagrams/${diagramId}`);
      runInAction(() => {
        this._diagrams = this._diagrams.filter((d) => d.id !== diagramId);
        if (this._currentDiagram?.id === diagramId) {
          this._currentDiagram = null;
        }
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось удалить диаграмму';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async fetchCharts(diagramId?: string) {
    this._isLoading = true;
    this._error = '';
    try {
      const response = await api.get<ChartResponse[]>('/charts/', {
        params: {
          diagramId: diagramId || undefined,
        },
      });
      runInAction(() => {
        this._charts = response.data;
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось загрузить конфигурации графиков';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async createChart(data: ChartCreate) {
    this._isLoading = true;
    this._error = '';
    try {
      const response = await api.post<ChartResponse>('/charts/', data);
      runInAction(() => {
        this._charts.push(response.data);
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось сохранить конфигурацию графика';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async updateChart(chartId: number, data: Partial<ChartCreate>) {
    this._isLoading = true;
    this._error = '';
    try {
      const response = await api.patch<ChartResponse>(`/charts/${chartId}`, data);
      runInAction(() => {
        this._charts = this._charts.map((c) => (c.id === chartId ? response.data : c));
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось обновить конфигурацию графика';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async deleteChart(chartId: number) {
    this._isLoading = true;
    this._error = '';
    try {
      await api.delete(`/charts/${chartId}`);
      runInAction(() => {
        this._charts = this._charts.filter((c) => c.id !== chartId);
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось удалить конфигурацию графика';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  resetStore() {
    runInAction(() => {
      this._diagrams = [];
      this._currentDiagram = null;
      this._charts = [];
      this._error = '';
    });
  }
}

export const diagramStore = new DiagramStore();
