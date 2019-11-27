import {request} from 'utils/request';
import {storage} from 'utils/storage';
import {CLIENT_SECRET, BASE_URL} from 'config';
import {AUTH_ROOT} from './auth.meta';
import {AuthInfo} from './auth.entity';

type GetAuthInfoResponse = {
  access_token: string;
  scope: string;
  user_id: string;
  team_id: string;
  token_type: string;
};
export async function getAuthInfoFromAPI(code: string, clientId: string): Promise<AuthInfo> {
  try {
    const response = await request.post<GetAuthInfoResponse>(
      `/oauth/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${CLIENT_SECRET}&code=${code}&redirect_uri=${BASE_URL}${AUTH_ROOT}`
    );
    const {
      access_token,
      scope,
      user_id,
      team_id,
      token_type
    } = response.data;
    return {
      accessToken: access_token,
      scope,
      userId: user_id,
      teamId: team_id,
      tokenType: token_type
    };
  } catch (error) {
    throw error.response.data;
  }
}

export async function saveAuthInfoToStorage(state: string, authInfo: AuthInfo): Promise<void> {
  try {
    await storage.set(state, authInfo);
  } catch (error) {
    throw error;
  }
}

export async function getAuthInfoFromStorage(state: string): Promise<AuthInfo | undefined> {
  try {
    return storage.get<AuthInfo>(state);
  } catch (error) {
    throw error;
  }
}
