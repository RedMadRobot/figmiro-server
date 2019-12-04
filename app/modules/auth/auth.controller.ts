import {Response, Router} from 'express';
import {OK, INTERNAL_SERVER_ERROR, getStatusText} from 'http-status-codes';
import {Controller} from 'utils/Controller';
import {RequestWithBody} from 'utils/RequestWithBody';
import {AppError} from 'utils/AppError';
import {signIn} from './auth.service';
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
        if (error.code) {
          res.status(error.code).json(error);
          return;
        }
        const appError = new AppError(getStatusText(INTERNAL_SERVER_ERROR));
        res.status(INTERNAL_SERVER_ERROR).json(appError);
      }
    }
    return ctx;
  })()
};
