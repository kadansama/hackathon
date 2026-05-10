import { makeAutoObservable, runInAction } from 'mobx';

import { userApi } from 'entities/user';
import type { UserData } from 'entities/user';

export class SessionStore {
  private _isAuth = false;
  private _userData: UserData | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async checkAuth() {
    const response = await userApi.me();

    runInAction(() => {
      if (response.isError || !response.data) {
        this._isAuth = false;
        this._userData = null;
        return;
      }

      this._isAuth = true;
      this._userData = response.data.data;
    });
  }

  logout() {
    this._userData = null;
    this._isAuth = false;
  }

  get isAuth() {
    return this._isAuth;
  }

  get userData() {
    return this._userData;
  }

  get fullName() {
    if (!this._userData) {
      return '';
    }

    return `${this._userData.lastName} ${this._userData.firstName} ${this._userData.middleName}`.trim();
  }

  destroy() {
    this._isAuth = false;
    this._userData = null;
  }
}

export const sessionStore = new SessionStore();
