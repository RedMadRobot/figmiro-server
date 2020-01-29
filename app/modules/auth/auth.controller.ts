import {Request, Response, Router} from 'express';
import {OK} from 'http-status-codes';
import {Controller} from 'utils/Controller';
import {RequestWithBody} from 'utils/RequestWithBody';
import {processError, checkUnauthorized} from 'utils/AppError';
import {signIn, logout} from './auth.service';
import {SignInDTO} from './auth.dto';

export const authController: Controller = {
  root: '/auth',
  ctx: (() => {
    const ctx = Router();

    ctx.post('/', processSignIn);
    async function processSignIn(req: RequestWithBody<SignInDTO>, res: Response): Promise<void> {
      try {
        const response = await signIn(req.body);
        res.status(OK).json(response);
      } catch (error) {
        processError(error, res);
      }
    }

    ctx.post('/logout', processLogout);
    async function processLogout(req: Request, res: Response): Promise<void> {
      try {
        checkUnauthorized(req);
        await logout(req);
        res.status(OK).send();
      } catch (error) {
        processError(error, res);
      }
    }

    return ctx;
  })()
};
