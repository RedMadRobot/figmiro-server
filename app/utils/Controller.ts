import {Router} from 'express';

export interface Controller {
  root: string;
  ctx: Router;
}
