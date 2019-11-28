import {Request, Response, Router} from 'express';
import {UNAUTHORIZED, OK, BAD_REQUEST, INTERNAL_SERVER_ERROR} from 'http-status-codes';
import {Controller} from 'utils/Controller';
import {AppError} from 'utils/AppError';
import {getAuthInfoFromAPI, getAuthInfoFromStorage, saveAuthInfoToStorage} from './auth.service';
import {AUTH_ROOT} from './auth.meta';
import {CheckAuthDto} from './auth.dto';

export const authController: Controller = {
  root: AUTH_ROOT,
  ctx: (() => {
    const ctx = Router();

    type ProcessInstallationQueryBody = {
      code: string;
      client_id: string;
      state: string;
    };
    ctx.get('/', processInstallation);
    async function processInstallation(req: Request, res: Response): Promise<void> {
      try {
        const {code, client_id, state} = req.query as ProcessInstallationQueryBody;
        const authInfo = await getAuthInfoFromAPI(code, client_id);
        await saveAuthInfoToStorage(state, authInfo);
        res.send('SUCCESS!');
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).send(error.message);
      }
    }

    type CheckAuthQueryBody = {
      state?: string;
    };
    ctx.get('/check', checkAuth);
    async function checkAuth(req: Request, res: Response): Promise<void> {
      try {
        const {state} = req.query as CheckAuthQueryBody;
        if (!state) {
          res.status(BAD_REQUEST).json(new AppError('Need stateValue in query!'));
          return;
        }
        const authInfo = await getAuthInfoFromStorage(state);
        if (!authInfo) {
          res.status(UNAUTHORIZED).json(new CheckAuthDto(false));
          return;
        }
        res.status(OK).json(new CheckAuthDto(true));
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json(new AppError(error.message));
      }
    }

    return ctx;
  })()
};
