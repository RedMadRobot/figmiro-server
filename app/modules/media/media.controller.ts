import path from 'path';
import express, {Router} from 'express';
import {Controller} from 'utils/Controller';

export const mediaController: Controller = {
  root: '/media',
  ctx: (() => {
    const ctx = Router();

    const pathToMedia = path.join(__dirname, 'media');
    ctx.use('/', express.static(pathToMedia));
    return ctx;
  })()
};
