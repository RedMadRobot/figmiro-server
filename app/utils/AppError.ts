/* tslint:disable:no-any */
import {Response, Request} from 'express';
import {FORBIDDEN, INTERNAL_SERVER_ERROR, getStatusText} from 'http-status-codes';

export function checkUnauthorized(req: Request): void | never {
  if (!req.headers.authorization) {
    throw new AppError(
      'Unauthorized',
      FORBIDDEN
    );
  }
}

export function processError(error: any, res: Response): void {
  if (error.code) {
    res.status(error.code).json(error);
    return;
  }
  const appError = new AppError(getStatusText(INTERNAL_SERVER_ERROR));
  res.status(INTERNAL_SERVER_ERROR).json(appError);
}

export class AppError {
  constructor(
    public readonly reason: string,
    public readonly code?: number,
    public readonly type = 'Error'
  ) {}
}
