import fs from 'fs-extra';
import uuid from 'uuid/v1';
import path from 'path';
import FormData from 'form-data';
import {request} from 'utils/request';
import {pipe} from 'utils/pipe';
import {RequestWithBody} from 'utils/RequestWithBody';
import {CreateOrUpdatePicturesDTO} from './pictures.dto';

export async function createOrUpdatePictures(
  req: RequestWithBody<CreateOrUpdatePicturesDTO>
): Promise<void> {
  const images = transformImagesToBase64(req.body.images);
  const imagesPaths = await saveImagesToTmp(images, req.body.boardId);
  try {
    const formData = new FormData();
    const data = {
      data: imagesPaths.map((_, index) => ({
        id: createImageId(index),
        type: 'ImageWidget',
        json: '{}'
      }))
    };
    formData.append('GraphicsPluginRequest', JSON.stringify(data), {contentType: 'application/json'});
    imagesPaths.forEach(imagePath => {
      formData.append('ArtboardName1', fs.createReadStream(imagePath));
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
    await removeImagesFromTmp(imagesPaths);
  }
}

async function saveImagesToTmp(images: string[], boardId: string): Promise<string[]> {
  return Promise.all(
    images.map(async (image: string, index: number) => {
      const fileName = `artboard_${boardId}_${uuid()}_${index}.png`;
      const fullPath = path.resolve('./tmp', fileName);
      await fs.outputFile(fullPath, image, 'base64');
      return fullPath;
    })
  );
}

async function removeImagesFromTmp(imagesFromTmp: string[]): Promise<void> {
  await Promise.all(
    imagesFromTmp.map(async imagePath => {
      await fs.remove(imagePath);
    })
  );
}

function transformImagesToBase64(images: string): string[] {
  return pipe([
    JSON.parse,
    (data: object[]) => data.map(Object.values),
    (data: number[][]) => data.map(Buffer.from),
    (data: Buffer[]) => data.map(buffer => buffer.toString('base64'))
  ])(images);
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
