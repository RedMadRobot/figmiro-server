import {request} from 'utils/request';
import {CLIENT_SECRET, BASE_URL} from 'config';
import {AUTH_ROOT} from './auth.meta';

type GetAuthInfoResponse = {
  access_token: string;
  scope: string;
  user_id: string;
  team_id: string;
  token_type: string;
};
export async function getAuthInfo(code: string, clientId: string): Promise<GetAuthInfoResponse> {
  try {
    const response = await request.post<GetAuthInfoResponse>(
      `/oauth/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${CLIENT_SECRET}&code=${code}&redirect_uri=${BASE_URL}${AUTH_ROOT}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
}
