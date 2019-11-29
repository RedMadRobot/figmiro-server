import {Request, Response, Router} from 'express';
import {INTERNAL_SERVER_ERROR, OK} from 'http-status-codes';
import {Controller} from 'utils/Controller';
import {getAll} from './boards.service';

export const boardsController: Controller = {
  root: '/boards',
  ctx: (() => {
    const ctx = Router();

    ctx.get('/', findAll);
    async function findAll(_: Request, res: Response): Promise<void> {
      try {
        const boards = await getAll();
        res.status(OK).json(boards);
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json(error);
      }
    }

    return ctx;
  })()
};
