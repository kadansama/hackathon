import { makeAutoObservable, runInAction } from 'mobx';

import { authApi } from 'features/auth/api/authApi';
import type { ILocalStore } from 'shared/lib/useLocalStore';

type FieldErrors = {
  form?: string;
  username?: string;
  password?: string;
};

export class LoginStore implements ILocalStore {
  private _username = '';
  private _password = '';
  private _success = false;
  private _errors: FieldErrors = {};

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setUsername(username: string) {
    this._username = username;
    this.clearErrors('username');
  }

  setPassword(password: string) {
    this._password = password;
    this.clearErrors('password');
  }

  clearErrors(field?: keyof FieldErrors) {
    if (field) {
      delete this._errors[field];
      return;
    }

    this._errors = {};
  }

  validate() {
    this._errors = {};

    if (!this._username) {
      this._errors.username = 'Имя пользователя обязательно';
    }

    if (!this._password) {
      this._errors.password = 'Пароль обязателен';
    }

    return Object.keys(this._errors).length === 0;
  }

  async login() {
    if (!this.validate()) {
      return false;
    }

    const result = await authApi.login({
      username: this._username,
      password: this._password,
    });

    runInAction(() => {
      this._success = false;
    });

    if (result.isError && !result.status) {
      runInAction(() => {
        this._errors.form = 'Соединение не установлено';
      });
      return false;
    }

    if (result.isError && result.status === 401) {
      runInAction(() => {
        this._errors.form = 'Неверное имя пользователя или пароль';
      });
      return false;
    }

    if (result.isError) {
      runInAction(() => {
        this._errors.form = 'Не удалось войти';
      });
      return false;
    }

    runInAction(() => {
      this._success = true;
    });

    return true;
  }

  get success() {
    return this._success;
  }

  get username() {
    return this._username;
  }

  get password() {
    return this._password;
  }

  get errors() {
    return this._errors;
  }

  get canSubmit() {
    return Boolean(this._username && this._password);
  }

  destroy() {
    this._username = '';
    this._password = '';
    this._errors = {};
    this._success = false;
  }
}
