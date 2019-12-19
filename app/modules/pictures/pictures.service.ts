import fs from 'fs-extra';
import uuid from 'uuid/v1';
import path from 'path';
import {INTERNAL_SERVER_ERROR} from 'http-status-codes';
import {omit, flow} from 'lodash';
import FormData from 'form-data';
import {AppError} from 'utils/AppError';
import {request} from 'utils/request';
import {RequestWithBody} from 'utils/RequestWithBody';
import {CreateOrUpdatePicturesDTO, CreateOrUpdatePicturesResponse} from './pictures.dto';
import {
  PictureStringed,
  Picture,
  PictureBuffered,
  PictureWithProperXY,
  WidgetWithFigmaId
} from './pictures.entity';

export async function createOrUpdatePictures(
  req: RequestWithBody<CreateOrUpdatePicturesDTO>
): Promise<WidgetWithFigmaId[]> {
  const pictures = await getPictures(req.body);
  try {
    const formData = new FormData();
    const data = {
      data: pictures.map(pic => ({
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
    };
    formData.append('GraphicsPluginRequest', JSON.stringify(data), {contentType: 'application/json'});
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
  return flow(
    JSON.parse,
    (picturesFromClient: PictureStringed[]) => picturesFromClient.map(pic => ({
      ...pic,
      image: Object.values(pic.image)
    })),
    (picturesFromClient: PictureStringed[]) => picturesFromClient.map(pic => ({
      ...pic,
      image: Buffer.from(pic.image)
    })),
    (picturesBuffered: PictureBuffered[]) => picturesBuffered.map(pic => ({
      ...pic,
      image: pic.image.toString('base64')
    })),
    (picturesBase64: PictureStringed[]) => picturesBase64.map(pic => ({
      ...omit(pic, 'width', 'height'),
      x: parseInt(pic.width, 10) / 2 - parseInt(pic.x, 10),
      y: parseInt(pic.height, 10) / 2 - parseInt(pic.y, 10)
    })),
    async (picturesWithProperXY: PictureWithProperXY[]) => Promise.all(picturesWithProperXY.map(
      async (pic, index) => {
        const fileName = `artboard_${dto.boardId}_${uuid()}_${index}.png`;
        const fullPath = path.resolve('./tmp', fileName);
        await fs.outputFile(fullPath, pic.image, 'base64');
        return {
          ...omit(pic, 'image'),
          fileName,
          imagePath: fullPath
        };
      }
    ))
  )(dto.images);
}

async function removeImagesFromTmp(pictures: Picture[]): Promise<void> {
  await Promise.all(
    pictures.map(async pic => {
      await fs.remove(pic.imagePath);
    })
  );
}
