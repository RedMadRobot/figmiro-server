import {Request} from 'express';
import {request} from 'utils/request';
import {SignInDTO} from './auth.dto';

type SignInResponse = {
  token: string;
};
export async function signIn(dto: SignInDTO): Promise<SignInResponse> {
  try {
    const response = await request.post<SignInResponse>('/auth', dto);
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
}

export async function logout(req: Request): Promise<void> {
  try {
    await request.post(
      '/auth/logout',
      undefined,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );
  } catch (error) {
    throw error.response.data.error;
  }
}
