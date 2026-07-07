import { isAxiosError } from 'axios';
import { api } from 'config/api';
import { computed, makeObservable, observable, runInAction } from 'mobx';
import type {
  UserPermissionsType,
  UserPermissionsRequestType,
  UnitTreeItem,
  BlockType,
  ActionType,
  DocumentPermissionResponseSchema,
} from 'types/index';

import type NotificationStore from '../NotificationStore';
import {
  normalizeUserType,
  type UserType,
  type UserTypeApi,
  type UserTypeModel,
} from '../models/user';

type PrivateFields =
  | '_error'
  | '_isLoading'
  | '_user'
  | '_managedUser'
  | '_managedPermissions'
  | '_usersList'
  | '_unitsTree'
  | '_myPermissions'
  | '_canManageDocuments'
  | '_managedDocPermission';

export default class UserStore {
  private notificationStore: NotificationStore;
  private _error = '';
  private _isLoading = false;
  private _user: UserTypeModel | null = null;

  private _usersList: UserTypeModel[] = [];
  private _unitsTree: UnitTreeItem[] = [];

  private _managedUser: UserTypeModel | null = null;
  private _managedPermissions: UserPermissionsType | null = null;

  private _myPermissions: UserPermissionsType = [];
  private _canManageDocuments = false;
  private _managedDocPermission = false;

  constructor(notificationStore: NotificationStore) {
    this.notificationStore = notificationStore;

    makeObservable<UserStore, PrivateFields>(this, {
      _error: observable,
      _isLoading: observable,
      _user: observable,
      _usersList: observable,
      _unitsTree: observable,
      _managedUser: observable,
      _managedPermissions: observable,
      _myPermissions: observable,
      _canManageDocuments: observable,
      _managedDocPermission: observable,

      isAuth: computed,
      error: computed,
      isLoading: computed,
      user: computed,
      managedUser: computed,
      managedPermissions: computed,
      usersList: computed,
      unitsTree: computed,
      myPermissions: computed,
      canManagePermissions: computed,
      canManageDocuments: computed,
      managedDocPermission: computed,
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

  get usersList(): UserTypeModel[] {
    return this._usersList;
  }

  get unitsTree(): UnitTreeItem[] {
    return this._unitsTree;
  }

  get myPermissions(): UserPermissionsType {
    return this._myPermissions;
  }

  get canManagePermissions(): boolean {
    const userRole = this._user?.role.toLowerCase();
    if (userRole === 'admin') return true;
    return this._myPermissions.some((p) => p.action === 'manage_permissions');
  }

  get canManageDocuments(): boolean {
    if (this._user?.role === 'admin') return true;
    return this._canManageDocuments;
  }

  get managedDocPermission(): boolean {
    return this._managedDocPermission;
  }

  hasBlockAccess(block: BlockType, action: ActionType = 'view'): boolean {
    const userRole = this._user?.role.toLowerCase();
    if (userRole === 'admin') return true;
    return this._myPermissions.some(
      (p) =>
        (p.block === block || p.block === 'all') &&
        (p.action === action || p.action === 'manage' || p.action === 'manage_permissions')
    );
  }

  canManageBlock(block: BlockType): boolean {
    const userRole = this._user?.role.toLowerCase();
    if (userRole === 'admin') return true;
    return this._myPermissions.some(
      (p) => (p.block === block || p.block === 'all') && p.action === 'manage'
    );
  }

  async loginUser(login: string, password: string) {
    this._error = '';
    this._isLoading = true;

    try {
      const response = await api.post(`/auth/login`, {
        login: login,
        password: password,
      });

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      const userResponse = await api.get<UserTypeApi>('/users/me');
      const permsResponse = await api.get<UserPermissionsType>(
        `/permissions/users/${userResponse.data.id}`
      );
      const docPermsResponse =
        await api.get<DocumentPermissionResponseSchema>('/permissions/documents');

      runInAction(() => {
        this._user = normalizeUserType(userResponse.data);
        this._myPermissions = permsResponse.data;
        this._canManageDocuments = docPermsResponse.data.can_upload_documents;
      });

      this.notificationStore.connect();
    } catch {
      runInAction(() => {
        this._error = 'Не удалось авторизоваться. Проверьте логин и пароль.';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async checkAuth() {
    if (!localStorage.getItem('access_token')) return;
    this._isLoading = true;
    try {
      const userResponse = await api.get('/users/me');
      const permsResponse = await api.get<UserPermissionsType>(
        `/permissions/users/${userResponse.data.id}`
      );

      const docPermsResponse =
        await api.get<DocumentPermissionResponseSchema>('/permissions/documents');

      runInAction(() => {
        this._user = normalizeUserType(userResponse.data);
        this._myPermissions = permsResponse.data;
        this._canManageDocuments = docPermsResponse.data.can_upload_documents;
      });

      this.notificationStore.connect();
    } catch {
      this.logout();
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<string | null> {
    this._isLoading = true;
    this._error = '';

    try {
      await api.patch('/users/me/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return 'Пароль успешно изменён';
    } catch (err: unknown) {
      runInAction(() => {
        if (isAxiosError(err) && err.response?.data?.detail) {
          this._error =
            typeof err.response.data.detail === 'string'
              ? err.response.data.detail
              : 'Ошибка валидации пароля';
        } else {
          this._error = 'Не удалось изменить пароль';
        }
      });
      return null;
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async resetUserPassword(userId: string): Promise<string | null> {
    this._isLoading = true;
    this._error = '';

    try {
      const response = await api.post<{ detail: string }>(`/users/${userId}/reset-password`);
      return response.data.detail || 'Новый пароль отправлен на почту';
    } catch (err: unknown) {
      runInAction(() => {
        if (isAxiosError(err) && err.response?.data?.detail) {
          this._error =
            typeof err.response.data.detail === 'string'
              ? err.response.data.detail
              : 'Ошибка сброса пароля';
        } else {
          this._error = 'Не удалось сбросить пароль';
        }
      });
      return null;
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.notificationStore.disconnect();
    runInAction(() => {
      this._user = null;
      this._myPermissions = [];
    });
  }

  async fetchUserData(userId: string) {
    this._isLoading = true;
    this._error = '';

    const [userResult, permissionsResult, docPermsResult] = await Promise.allSettled([
      api.get<UserTypeApi>(`/users/${userId}`),
      api.get<UserPermissionsType>(`/permissions/users/${userId}`),
      api.get<DocumentPermissionResponseSchema>(`/permissions/documents/${userId}`),
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

      if (docPermsResult.status === 'fulfilled') {
        this._managedDocPermission = docPermsResult.value.data.can_upload_documents;
      } else {
        this._managedDocPermission = false;
      }

      this._isLoading = false;
    });
  }

  resetManagedUser() {
    runInAction(() => {
      this._managedUser = null;
      this._managedPermissions = null;
      this._managedDocPermission = false;
      this._error = '';
    });
  }

  async createUser(user: UserType): Promise<string | null> {
    this._isLoading = true;
    this._error = '';
    try {
      const response = await api.post<{ id: string }>('/users/', {
        login: user.login,
        full_name: user.full_name,
        role: user.role,
        job_title: user.job_title,
        email: user.email,
        is_active: user.is_active,
      });
      return response.data.id;
    } catch {
      runInAction(() => {
        this._error = 'Не удалось создать пользователя';
      });
      return null;
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async updateUser(userId: string, data: Partial<UserType>) {
    this._isLoading = true;
    this._error = '';
    try {
      const response = await api.patch<UserTypeApi>(`/users/${userId}`, {
        login: data.login,
        full_name: data.full_name,
        role: data.role,
        job_title: data.job_title,
        email: data.email,
        is_active: data.is_active,
      });
      runInAction(() => {
        this._managedUser = normalizeUserType(response.data);
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось обновить данные пользователя';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async fetchUsersList() {
    this._usersList = [];
    try {
      const response = await api.get<UserTypeApi[]>('/users/');

      runInAction(() => {
        this._usersList = response.data.map(normalizeUserType);
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось получить список пользователей';
      });
    }
  }

  async fetchUnitsTree() {
    this._isLoading = true;
    try {
      const response = await api.get<UnitTreeItem[]>('/units/tree');
      runInAction(() => {
        this._unitsTree = response.data;
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось загрузить структуру подразделений';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async grantPermissions(userId: string, payload: UserPermissionsRequestType) {
    this._isLoading = true;
    this._error = '';

    try {
      const response = await api.post<UserPermissionsType>(`/permissions/users/${userId}`, payload);

      runInAction(() => {
        this._managedPermissions = response.data;
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось выдать права пользователю';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async revokePermissions(userId: string, payload: UserPermissionsRequestType) {
    this._isLoading = true;
    this._error = '';

    try {
      await api.delete(`/permissions/users/${userId}`, { data: payload.permissions });
      const response = await api.get<UserPermissionsType>(`/permissions/users/${userId}`);

      runInAction(() => {
        this._managedPermissions = response.data;
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось отозвать права у пользователя';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  async setDocumentPermission(userId: string, canUpload: boolean) {
    this._isLoading = true;
    this._error = '';
    try {
      const response = await api.post<DocumentPermissionResponseSchema>(
        `/permissions/documents/${userId}`,
        { can_upload_documents: canUpload }
      );
      runInAction(() => {
        this._managedDocPermission = response.data.can_upload_documents;
      });
    } catch {
      runInAction(() => {
        this._error = 'Не удалось обновить права на документы';
      });
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }
}
