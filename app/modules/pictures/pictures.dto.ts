import {Widget} from './pictures.entity';

export type CreateOrUpdatePicturesDTO = {
  boardId: string,
  images: string,
  scale: boolean
};

export type CreateOrUpdatePicturesResponse = {
  widgets: Widget[]
};
