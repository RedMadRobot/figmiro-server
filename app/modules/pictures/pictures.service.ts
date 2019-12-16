import fs from 'fs-extra';
import path from 'path';
import FormData from 'form-data';
import {request} from 'utils/request';
import {pipe} from 'utils/pipe';
import {CreateOrUpdatePictureDTO, CreateOrUpdatePicturesDTO} from './pictures.dto';

export async function createOrUpdatePictures(dto: CreateOrUpdatePicturesDTO): Promise<void> {
  const images = transformImagesToBase64(dto.images);
  const imagesPaths = await saveImagesToTmp(images);
  try {
    await Promise.all(
      imagesPaths.map(
        imagePath => createOrUpdatePicture({boardId: dto.boardId, imagePath})
      )
    );
  } finally {
    await removeImagesFromTmp(imagesPaths);
  }
}

export async function createOrUpdatePicture(dto: CreateOrUpdatePictureDTO): Promise<void> {
  try {
    const formData = new FormData();
    const data = {
      data: [
        {
          id: '3074457345676563185',
          type: 'ImageWidget',
          json: '{}'
        }
      ]
    };
    formData.append('GraphicsPluginRequest', JSON.stringify(data), {contentType: 'application/json'});
    formData.append('ArtboardName1', fs.createReadStream(dto.imagePath));
    await request.post(
      `/boards/${dto.boardId}/integrations/imageplugin`,
      formData,
      {
      headers: {
        Authorization: `hash rCLZjcYe4pKwGqr9wMU0wlRCNf1oLy3f5XfSeNQUElur5E3w1qK9e8oC9lr2ldDE`,
        ...formData.getHeaders()
      }
    });
  } catch (e) {
    if (e.response) {
      console.log(e.response);
      return;
    }
    console.log(e);
  }
}

async function saveImagesToTmp(images: string[]): Promise<string[]> {
  return Promise.all(
    images.map(async (image: string, index: number) => {
      const fullPath = path.resolve('./tmp', `artboard_${index}.png`);
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
