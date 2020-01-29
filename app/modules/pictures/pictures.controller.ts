import {Request, Response, Router} from 'express';
import {OK} from 'http-status-codes';
import {Controller} from 'utils/Controller';
import {checkUnauthorized, processError} from 'utils/AppError';
import {createOrUpdatePictures, upload} from './pictures.service';

export const picturesController: Controller = {
  root: '/pictures',
  ctx: (() => {
    const ctx = Router();

    ctx.post('/', upload.array('image'), processCreateOrUpdatePicture);
    async function processCreateOrUpdatePicture(req: Request, res: Response): Promise<void> {
      try {
        checkUnauthorized(req);
        const widgets = await createOrUpdatePictures(req);
        res.status(OK).json(widgets);
      } catch (error) {
        processError(error, res);
      }
    }
    return ctx;
  })()
};
