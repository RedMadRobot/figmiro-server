import {Widget} from './pictures.entity';

export type CreateOrUpdatePicturesDTO = {
  boardId: string,
  scale: string,
  imageMeta: string[]
};

export type CreateOrUpdatePicturesResponse = {
  widgets: Widget[]
};
