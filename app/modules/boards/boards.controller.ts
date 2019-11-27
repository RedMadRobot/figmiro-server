import {Request, Response, Router} from 'express';
import {IController} from 'utils/Controller';
import {getAuthInfoFromStorage} from 'modules/auth';
import {getAll} from './boards.service';

export const boardsController: IController = {
  root: '/boards',
  ctx: (() => {
    const ctx = Router();

    type FindAllQueryBody = {
      state: string;
    };
    ctx.get('/', findAll);
    async function findAll(req: Request, res: Response): Promise<void> {
      try {
        const {state} = req.query as FindAllQueryBody;
        const authInfo = await getAuthInfoFromStorage(state);
        const boards = await getAll(authInfo);
        res.send(boards);
      } catch (error) {
        res.send(error.data);
      }
    }

    return ctx;
  })()
};
