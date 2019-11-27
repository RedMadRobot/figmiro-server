import {Router} from 'express';

export interface IController {
  root: string;
  ctx: Router;
}
