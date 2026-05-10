import { customPost } from 'shared/api/client';
import type { LoginData, SignUpData } from 'features/auth/model/types';

export const authApi = {
  signUp(data: SignUpData) {
    return customPost<SignUpData, { id: string }>('/auth/register', data);
  },

  login(data: LoginData) {
    return customPost<LoginData, { id: string }>('/auth/login', data);
  },
};
