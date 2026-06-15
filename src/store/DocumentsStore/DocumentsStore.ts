import { api } from 'config/api';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import {
  normalizeDocInfo,
  normalizeDocType,
  type DocInfoApi,
  type DocInfoModel,
  type DocTypeApi,
  type DocTypeModel,
} from 'store/models/docs';

type PrivateFields = '_error' | '_isLoading' | '_docs' | '_currentDocInfo';

export default class DocumentsStore {
  private _error = '';
  private _isLoading = false;
  private _docs: DocTypeModel[] = [];
  private _currentDocInfo: DocInfoModel | null = null;

  constructor() {
    makeObservable<DocumentsStore, PrivateFields>(this, {
      _error: observable,
      _isLoading: observable,
      _docs: observable,
      _currentDocInfo: observable,

      error: computed,
      isLoading: computed,
      docs: computed,
      currentDocInfo: computed,

      getDocsList: action,
      getMyDocsList: action,
      getDocInfo: action,
      uploadDoc: action,
      deleteDoc: action,
      downloadDoc: action,
    });
  }

  get error(): string {
    return this._error;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get docs() {
    return this._docs;
  }

  get currentDocInfo() {
    return this._currentDocInfo;
  }

  async getDocsList(skip = 0, limit = 100) {
    this._isLoading = true;
    this._error = '';

    try {
      const response = await api.get<DocTypeApi[]>('/files/', {
        params: {
          skip,
          limit,
        },
      });

      runInAction(() => {
        this._docs = response.data.map((item) => normalizeDocType(item));
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось загрузить документы';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async getMyDocsList(skip = 0, limit = 100) {
    this._isLoading = true;
    this._error = '';

    try {
      const response = await api.get<DocTypeApi[]>('/files/my/files', {
        params: {
          skip,
          limit,
        },
      });

      runInAction(() => {
        this._docs = response.data.map((item) => normalizeDocType(item));
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось загрузить документы';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async getDocInfo(fileId: string) {
    this._isLoading = true;
    this._error = '';

    try {
      const response = await api.get<DocInfoApi>(`/files/${fileId}`);

      runInAction(() => {
        this._currentDocInfo = normalizeDocInfo(response.data);
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось загрузить информацию о документе';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async uploadDoc(formData: FormData) {
    this._isLoading = true;
    this._error = '';

    try {
      await api.post(`/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось загрузить документ';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async deleteDoc(fileId: string) {
    this._isLoading = true;
    this._error = '';

    try {
      await api.delete(`/files/${fileId}`);
      runInAction(() => {
        this._docs = this._docs.filter((d) => d.id !== fileId);
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось удалить документ';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async downloadDoc(fileId: string, fileName: string) {
    this._isLoading = true;
    this._error = '';

    try {
      const response = await api.get(`/files/${fileId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);

      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      runInAction(() => {
        this._error = 'Не удалось скачать документ';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }
}
