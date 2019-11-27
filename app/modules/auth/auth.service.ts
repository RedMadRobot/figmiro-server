import {request} from 'utils/request';
import {CLIENT_SECRET, BASE_URL} from 'config';

type GetAuthInfoResponse = {
  accessToken: string;
  scope: string;
  userId: string;
  teamId: string;
  tokenType: string;
};
export async function getAuthInfo(code: string, clientId: string) {
  await request.post<GetAuthInfoResponse>(
    `/oauth/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${CLIENT_SECRET
      }&code=${code}&redirect_uri=${BASE_URL}/oauth`
  );
}
