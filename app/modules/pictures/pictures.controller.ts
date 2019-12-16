import {Request, Response, Router} from 'express';
import {OK} from 'http-status-codes';
import {Controller} from 'utils/Controller';
import {checkUnauthorized, processError} from 'utils/AppError';
import {createOrUpdatePictures} from './pictures.service';

export const picturesController: Controller = {
  root: '/pictures',
  ctx: (() => {
    const ctx = Router();

    ctx.post('/', processCreateOrUpdatePicture);
    async function processCreateOrUpdatePicture(req: Request, res: Response): Promise<void> {
      try {
        checkUnauthorized(req);
        await createOrUpdatePictures(req);
        res.status(OK).send();
      } catch (error) {
        processError(error, res);
      }
    }
    return ctx;
  })()
};
