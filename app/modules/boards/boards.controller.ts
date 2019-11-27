import {Request, Response, Router} from 'express';
import {BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, OK} from 'http-status-codes';
import {AppError} from 'utils/AppError';
import {IController} from 'utils/Controller';
import {getAuthInfoFromStorage} from 'modules/auth';
import {getAll} from './boards.service';

export const boardsController: IController = {
  root: '/boards',
  ctx: (() => {
    const ctx = Router();

    type FindAllQueryBody = {
      state?: string;
    };
    ctx.get('/', findAll);
    async function findAll(req: Request, res: Response): Promise<void> {
      try {
        const {state} = req.query as FindAllQueryBody;
        if (!state) {
          res.status(BAD_REQUEST).json(new AppError('Need stateValue in query!'));
          return;
        }
        const authInfo = await getAuthInfoFromStorage(state);
        if (!authInfo) {
          res.status(FORBIDDEN).json(new AppError('Boards: Auth required!'));
          return;
        }
        const boards = await getAll(authInfo);
        res.status(OK).json(boards);
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json(error);
      }
    }

    return ctx;
  })()
};
