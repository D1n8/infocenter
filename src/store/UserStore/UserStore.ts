import { api } from 'config/api';
import { computed, makeObservable, observable, runInAction } from 'mobx';
import type { UserPermissionsType } from 'types/index';

import { normalizeUserType, type UserTypeApi, type UserTypeModel } from '../models/user';

type PrivateFields = '_error' | '_isLoading' | '_user' | '_managedUser' | '_managedPermissions';

export default class UserStore {
  private _error = '';
  private _isLoading = false;
  private _user: UserTypeModel | null = null;

  private _managedUser: UserTypeModel | null = null;
  private _managedPermissions: UserPermissionsType | null = null;

  constructor() {
    makeObservable<UserStore, PrivateFields>(this, {
      _error: observable,
      _isLoading: observable,
      _user: observable,
      _managedUser: observable,
      _managedPermissions: observable,

      isAuth: computed,
      error: computed,
      isLoading: computed,
      user: computed,
      managedUser: computed,
      managedPermissions: computed,
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

  get managedUser(): UserTypeModel | null {
    return this._managedUser;
  }

  get managedPermissions(): UserPermissionsType | null {
    return this._managedPermissions;
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

  async fetchUserData(userId: string) {
    this._isLoading = true;
    this._error = '';

    const [userResult, permissionsResult] = await Promise.allSettled([
      api.get<UserTypeApi>(`/users/${userId}`),
      api.get<UserPermissionsType>(`/permissions/users/${userId}`),
    ]);

    runInAction(() => {
      if (userResult.status === 'fulfilled') {
        this._managedUser = normalizeUserType(userResult.value.data);
      } else {
        this._error = 'Не удалось загрузить данные пользователя';
      }

      if (permissionsResult.status === 'fulfilled') {
        this._managedPermissions = permissionsResult.value.data;
      } else {
        this._managedPermissions = [];
      }

      this._isLoading = false;
    });
  }

  resetManagedUser() {
    runInAction(() => {
      this._managedUser = null;
      this._managedPermissions = null;
      this._error = '';
    });
  }
}

export const userStore = new UserStore();
