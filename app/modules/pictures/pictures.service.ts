import fs from 'fs-extra';
import uuid from 'uuid/v1';
import path from 'path';
import {omit, flow} from 'lodash';
import FormData from 'form-data';
import {request} from 'utils/request';
import {RequestWithBody} from 'utils/RequestWithBody';
import {CreateOrUpdatePicturesDTO} from './pictures.dto';
import {PictureStringed, Picture, PictureBuffered, PictureWithProperXY} from './pictures.entity';

export async function createOrUpdatePictures(
  req: RequestWithBody<CreateOrUpdatePicturesDTO>
): Promise<void> {
  const pictures = await getPictures(req.body);
  try {
    const formData = new FormData();
    const data = {
      data: pictures.map((pic, index) => ({
        id: createImageId(index),
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
    await request.post(
      `/boards/${req.body.boardId}/integrations/imageplugin`,
      formData,
      {
        headers: {
          Authorization: req.headers.authorization,
          ...formData.getHeaders()
        }
      }
    );
  } catch (error) {
    console.log(error.response.data.error);
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

// TODO: do smth with it
function createImageId(index: number): string {
  const indexString = `${index}`;
  const MAX_IMAGES = 1000000;
  const idPart = `${MAX_IMAGES}${indexString}`
    .split('')
    .splice(indexString.length)
    .join('');
  return `307445734567${idPart}`;
}
