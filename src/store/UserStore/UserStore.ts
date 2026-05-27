import { api } from 'config/api';
import { computed, makeObservable, observable, runInAction } from 'mobx';

import { normalizeUserType, type UserTypeModel } from '../models/user';

type PrivateFields = '_error' | '_isLoading' | '_user';

export default class UserStore {
  private _error = '';
  private _isLoading = false;
  private _user: UserTypeModel | null = null;

  constructor() {
    makeObservable<UserStore, PrivateFields>(this, {
      _error: observable,
      _isLoading: observable,
      _user: observable,

      isAuth: computed,
      error: computed,
      isLoading: computed,
      user: computed,
    });
  }

  get isAuth(): boolean {
    return Boolean(this._user);
  }

  get error(): string {
    return this._error;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get user(): UserTypeModel | null {
    return this._user;
  }

  async loginUser(login: string, password: string) {
    this._error = '';
    this._isLoading = true;

    try {
      const response = await api.post('/auth/login', {
        login: login,
        password: password,
      });

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      const userResponse = await api.get('/users/me');

      runInAction(() => {
        this._user = normalizeUserType(userResponse.data);
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось авторизоваться';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async checkAuth() {
    if (!localStorage.getItem('access_token')) {
      return;
    }

    this._isLoading = true;

    try {
      const userResponse = await api.get('/users/me');
      runInAction(() => {
        this._user = normalizeUserType(userResponse.data);
      });
    } catch {
      this.logout();
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    runInAction(() => {
      this._user = null;
    });
  }
}

export const userStore = new UserStore();
