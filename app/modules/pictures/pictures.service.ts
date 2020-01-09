import fs from 'fs-extra';
import uuid from 'uuid/v1';
import path from 'path';
import {INTERNAL_SERVER_ERROR} from 'http-status-codes';
import {omit} from 'lodash';
import FormData from 'form-data';
import {AppError} from 'utils/AppError';
import {request} from 'utils/request';
import {RequestWithBody} from 'utils/RequestWithBody';
import {CreateOrUpdatePicturesDTO, CreateOrUpdatePicturesResponse} from './pictures.dto';
import {Picture, WidgetWithFigmaId} from './pictures.entity';

export async function createOrUpdatePictures(
  req: RequestWithBody<CreateOrUpdatePicturesDTO>
): Promise<WidgetWithFigmaId[]> {
  const pictures = await getPictures(req.body);
  try {
    const formData = new FormData();
    const data = JSON.stringify({
      data: pictures.map(pic => ({
        ...(pic.resourceId ? {id: pic.resourceId} : {}),
        type: 'ImageWidget',
        json: JSON.stringify({
          transformationData: {
            positionData: {
              x: pic.x,
              y: pic.y
            },
            ...(req.body.scale ? {scaleData: {scale: 0.5}} : {})
          }
        })
      }))
    });
    formData.append('GraphicsPluginRequest', data, {contentType: 'application/json'});
    pictures.forEach(pic => {
      formData.append('ArtboardName1', fs.createReadStream(pic.imagePath));
    });
    const response = await request.post<CreateOrUpdatePicturesResponse>(
      `/boards/${req.body.boardId}/integrations/imageplugin`,
      formData,
      {
        headers: {
          Authorization: req.headers.authorization,
          ...formData.getHeaders()
        }
      }
    );
    return response.data.widgets.map(widget => {
      const founded = pictures.find(picture => widget.name === picture.fileName);
      if (!founded) throw new AppError('Server error', INTERNAL_SERVER_ERROR);
      return {
        ...widget,
        figmaId: founded.id
      };
    });
  } catch (error) {
    throw error.response.data.error;
  } finally {
    await removeImagesFromTmp(pictures);
  }
}

async function getPictures(dto: CreateOrUpdatePicturesDTO): Promise<Picture[]> {
  return Promise.all(dto.images.map(
    async pic => {
      const fileName = `${pic.name}.png`
      const imagePath = path.resolve('./tmp', uuid(), fileName);
      const imageFile = Buffer.from(Object.values(pic.image)).toString('base64');
      await fs.outputFile(imagePath, imageFile, 'base64');
      return {
        ...omit(pic, 'image'),
        fileName,
        imagePath
      };
    }
  ));
}

async function removeImagesFromTmp(pictures: Picture[]): Promise<void> {
  await Promise.all(
    pictures.map(async pic => {
      await fs.remove(path.dirname(pic.imagePath));
    })
  );
}
