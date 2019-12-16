import fs from 'fs-extra';
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
  const imagesPaths = await saveImagesToTmp(images);
  try {
    const formData = new FormData();
    const data = {
      data: imagesPaths.map((_, index) => ({
        id: `307445734567656418${index}`,
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
