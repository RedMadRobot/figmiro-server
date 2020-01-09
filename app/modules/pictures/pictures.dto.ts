import {Widget, PictureFromClient} from './pictures.entity';

export type CreateOrUpdatePicturesDTO = {
  boardId: string,
  images: PictureFromClient[],
  scale: boolean
};

export type CreateOrUpdatePicturesResponse = {
  widgets: Widget[]
};
