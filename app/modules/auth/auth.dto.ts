export class CheckAuthDto {
  constructor(
    readonly isAuthorized: boolean
  ) {}
}

export type SignInDTO = {
  email: string;
  password: string;
};
