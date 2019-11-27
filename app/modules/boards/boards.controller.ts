import {Request, Response, Router} from 'express';
import {IController} from 'utils/Controller';
import {getAuthInfoFromStorage} from 'modules/auth';
import {getAll} from './boards.service';

export const boardsController: IController = {
  root: '/boards',
  ctx: (() => {
    const ctx = Router();

    ctx.get('/', findAll);
    async function findAll(_: Request, res: Response): Promise<void> {
      try {
        const authInfo = await getAuthInfoFromStorage('wdwqd');
        const boards = await getAll(authInfo);
        res.send(boards);
      } catch (error) {
        res.send(error.data);
      }
    }

    return ctx;
  })()
};
