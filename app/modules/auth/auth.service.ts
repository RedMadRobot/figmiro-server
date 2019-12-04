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
