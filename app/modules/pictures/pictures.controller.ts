import {Request, Response, Router} from 'express';
import {INTERNAL_SERVER_ERROR, OK} from 'http-status-codes';
import {Controller} from 'utils/Controller';
import {createOrUpdatePictures} from './pictures.service';

export const picturesController: Controller = {
  root: '/pictures',
  ctx: (() => {
    const ctx = Router();

    ctx.post('/', processCreateOrUpdatePicture);
    async function processCreateOrUpdatePicture(req: Request, res: Response): Promise<void> {
      // try {
        await createOrUpdatePictures(req.body);
        res.status(OK).send();
      // } catch (error) {
      //   res.status(INTERNAL_SERVER_ERROR).json(error);
      // }
    }
    return ctx;
  })()
};
