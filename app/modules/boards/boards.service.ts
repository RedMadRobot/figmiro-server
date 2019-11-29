import {request} from 'utils/request';
import {Boards} from './board.entity';

type GetAllResponse = {
  data: Boards;
};
export async function getAll(): Promise<Boards> {
  const response = await request.get<GetAllResponse>(
    '/boards',
    {
      params: {
        sort: 'LAST_OPENED',
        fields: 'title,id,currentUserPermission{role},lastOpenedByMeDate',
        limit: 1000
      },
      headers: {
        Authorization: `hash rCLZjcYe4pKwGqr9wMU0wlRCNf1oLy3f5XfSeNQUElur5E3w1qK9e8oC9lr2ldDE`
      }
    }
  );
  return response.data.data;
}
