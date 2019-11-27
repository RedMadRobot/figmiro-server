import {Request, Response, Router} from 'express';
import {IController} from 'utils/Controller';
import {getAll} from './boards.service';

export const boardsController: IController = {
  root: '/boards',
  ctx: (() => {
    const ctx = Router();

    ctx.get('/', findAll);
    async function findAll(_: Request, res: Response): Promise<void> {
      try {
        const boards = await getAll();
        res.send(boards);
      } catch (error) {
        res.send(error.data);
      }
    }

    return ctx;
  })()
};
