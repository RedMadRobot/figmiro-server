import {Request, Response, Router} from 'express';
import {IController} from 'utils/Controller';
import {getAuthInfo} from './auth.service';
import {AUTH_ROOT} from './auth.meta';

export const authController: IController = {
  root: AUTH_ROOT,
  ctx: (() => {
    const ctx = Router();

    type ProcessInstallationQueryBody = {
      code: string;
      client_id: string;
    };
    ctx.get('/', processInstallation);
    async function processInstallation(req: Request, res: Response): Promise<void> {
      try {
        const {code, client_id} = req.query as ProcessInstallationQueryBody;
        const authInfo = await getAuthInfo(code, client_id);
        res.send(authInfo);
      } catch (error) {
        res.send(error);
      }
    }

    return ctx;
  })()
};