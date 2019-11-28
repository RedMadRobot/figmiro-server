import {Request, Response, Router} from 'express';
import {FORBIDDEN, INTERNAL_SERVER_ERROR, BAD_REQUEST, OK} from 'http-status-codes';
import {Controller} from 'utils/Controller';
import {AppError} from 'utils/AppError';
import {getAuthInfoFromStorage} from 'modules/auth';
import {createOrUpdatePictures} from './pictures.service';

export const picturesController: Controller = {
  root: '/pictures',
  ctx: (() => {
    const ctx = Router();

    type CreateOrUpdatePictureQuery = {
      state?: string;
    };
    ctx.post('/', processCreateOrUpdatePicture);
    async function processCreateOrUpdatePicture(req: Request, res: Response): Promise<void> {
      try {
        const {state} = req.query as CreateOrUpdatePictureQuery;
        if (!state) {
          res.status(BAD_REQUEST).json(new AppError('Need stateValue in query!'));
          return;
        }
        const authInfo = await getAuthInfoFromStorage(state);
        if (!authInfo) {
          res.status(FORBIDDEN).json(new AppError('Pictures: Auth required!'));
          return;
        }
        await createOrUpdatePictures(authInfo, req.body);
        res.status(OK).send();
      } catch (error) {
        res.status(INTERNAL_SERVER_ERROR).json(error);
      }
    }
    return ctx;
  })()
};
