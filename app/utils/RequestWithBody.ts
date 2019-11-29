import {Request} from 'express';

export interface RequestWithBody<T> extends Request {
  body: T;
}
