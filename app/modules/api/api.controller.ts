import {Router} from 'express';
import rateLimit from 'express-rate-limit';
import {Controller} from 'utils/Controller';
import {picturesController} from 'modules/pictures';
import {authController} from 'modules/auth';
import {boardsController} from 'modules/boards';

export const apiController: Controller = {
  root: '/api',
  ctx: (() => {
    const ctx = Router();
    ctx.use(rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    }));
    ctx.use(picturesController.root, picturesController.ctx);
    ctx.use(authController.root, authController.ctx);
    ctx.use(boardsController.root, boardsController.ctx);
    return ctx;
  })()
};
