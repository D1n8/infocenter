import { BASE_URL } from 'App/consts';
import axios from 'axios';
import { computed, makeObservable, observable, runInAction } from 'mobx';

import { type UserTypeModel } from '../models/user';

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
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        login: login,
        password: password,
      });

      runInAction(() => {
        // this._user = normalizeUserType(response)
        console.log(response);
      });
    } catch {
      console.error('qewrewr');
    }
  }
}

export const userStore = new UserStore();
