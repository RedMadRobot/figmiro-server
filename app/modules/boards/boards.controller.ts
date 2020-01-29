import {Request, Response, Router} from 'express';
import {OK} from 'http-status-codes';
import {Controller} from 'utils/Controller';
import {checkUnauthorized, processError} from 'utils/AppError';
import {getAll} from './boards.service';

export const boardsController: Controller = {
  root: '/boards',
  ctx: (() => {
    const ctx = Router();

    ctx.get('/', findAll);
    async function findAll(req: Request, res: Response): Promise<void> {
      try {
        checkUnauthorized(req);
        const boards = await getAll(req);
        res.status(OK).json(boards);
      } catch (error) {
        processError(error, res);
      }
    }

    return ctx;
  })()
};
