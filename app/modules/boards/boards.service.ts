import {Request} from 'express';
import {request} from 'utils/request';
import {Boards} from './board.entity';

type GetAllResponse = {
  data: Boards;
};
export async function getAll(req: Request): Promise<Boards> {
  try {
    const response = await request.get<GetAllResponse>(
      '/boards',
      {
        params: {
          sort: 'LAST_OPENED',
          fields: 'title,id,currentUserPermission{role},lastOpenedByMeDate',
          limit: 1000
        },
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );
    return response.data.data;
  } catch (error) {
    throw error.response.data.error;
  }
}
