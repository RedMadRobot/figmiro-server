import {Request, Response, Router} from 'express';
import {IController} from 'utils/Controller';
import {getAuthInfoFromAPI, saveAuthInfoToStorage} from './auth.service';
import {AUTH_ROOT} from './auth.meta';

export const authController: IController = {
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
        res.send(error.message);
      }
    }

    return ctx;
  })()
};
