import {Request, Response, Router} from 'express';
import {UNAUTHORIZED, OK, BAD_REQUEST, INTERNAL_SERVER_ERROR} from 'http-status-codes';
import {Controller} from 'utils/Controller';
import {RequestWithBody} from 'utils/RequestWithBody';
import {AppError} from 'utils/AppError';
import {signIn, getAuthInfoFromAPI, getAuthInfoFromStorage, saveAuthInfoToStorage} from './auth.service';
import {CheckAuthDto, SignInDTO} from './auth.dto';

export const authController: Controller = {
  root: '/auth',
  ctx: (() => {
    const ctx = Router();

    ctx.post('/', processSignIn);
    async function processSignIn(req: RequestWithBody<SignInDTO>, res: Response): Promise<void> {
      try {
        if (!req.body.email) {
          res.status(BAD_REQUEST).json(new AppError('SIGNIN_NEED_EMAIL'));
          return;
        }
        if (!req.body.password) {
          res.status(BAD_REQUEST).json(new AppError('SIGNIN_NEED_PASSWORD'));
          return;
        }
        await signIn(req.body);
        res.status(OK).end();
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json(error);
      }
    }

    // type ProcessInstallationQueryBody = {
    //   code: string;
    //   client_id: string;
    //   state: string;
    // };
    // ctx.get('/', processInstallation);
    // async function processInstallation(req: Request, res: Response): Promise<void> {
    //   try {
    //     const {code, client_id, state} = req.query as ProcessInstallationQueryBody;
    //     const authInfo = await getAuthInfoFromAPI(code, client_id);
    //     await saveAuthInfoToStorage(state, authInfo);
    //     res.send('SUCCESS!');
    //   } catch (error) {
    //     res.status(INTERNAL_SERVER_ERROR).send(error.message);
    //   }
    // }

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
