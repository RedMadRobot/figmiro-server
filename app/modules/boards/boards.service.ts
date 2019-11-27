import {request} from 'utils/request';
import {AuthInfo} from 'modules/auth';
import {Boards} from './board.entity';

type GetAllResponse = {
  data: Boards;
};
export async function getAll(auth: AuthInfo): Promise<Boards> {
  const response = await request.get<GetAllResponse>(`/accounts/${auth.teamId}/boards`, {
    headers: {
      Authorization: `${auth.tokenType} ${auth.accessToken}`
    }
  });
  return response.data.data;
}
