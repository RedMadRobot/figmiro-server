import {request} from 'utils/request';
import {Boards} from './board.entity';

type GetAllResponse = {
  data: Boards;
};
export async function getAll(): Promise<Boards> {
  const response = await request.get<GetAllResponse>('/accounts/3074457347044577000/boards', {
    headers: {
      Authorization: 'Bearer d97e2da1-9e08-4abf-8d5e-72d970d1ddd8'
    }
  });
  return response.data.data;
}
