import fs from 'fs-extra';
import path from 'path';
import FormData from 'form-data';
import {request} from 'utils/request';
import {pipe} from 'utils/pipe';
import {CreateOrUpdatePictureDTO, CreateOrUpdatePicturesDTO} from './pictures.dto';

export async function createOrUpdatePictures(dto: CreateOrUpdatePicturesDTO): Promise<void> {
  const paths = await transformImages(dto.images);
  await Promise.all(
    paths.map(
      imagePath => createOrUpdatePicture({boardId: dto.boardId, imagePath})
    )
  );
}

export async function createOrUpdatePicture(dto: CreateOrUpdatePictureDTO): Promise<void> {
  try {
    const formData = new FormData();
    // const data = {
    //   data: [
    //     {
    //       id: '1234',
    //       type: 'ImageWidget',
    //       json: '{}'
    //     }
    //   ]
    // };
    formData.append('GraphicsPluginRequest', '{"data":[{"id": "3074457345676563085","type": "ImageWidget","json": "{}"}]}', {contentType: 'application/json'});
    formData.append('ArtboardName1', fs.createReadStream(dto.imagePath));
    const response = await request.post(
      `/boards/${dto.boardId}/integrations/imageplugin`,
      formData,
      {
      headers: {
        Authorization: `hash rCLZjcYe4pKwGqr9wMU0wlRCNf1oLy3f5XfSeNQUElur5E3w1qK9e8oC9lr2ldDE`,
        ...formData.getHeaders()
      }
    });
    console.log(response);
  } catch (e) {
    if (e.response) {
      console.log(e.response);
      return;
    }
    console.log(e);
  }
}

async function transformImages(images: string): Promise<string[]> {
  const base64images = pipe([
    JSON.parse,
    (data: object[]) => data.map(Object.values),
    (data: number[][]) => data.map(Buffer.from),
    (data: Buffer[]) => data.map(buffer => buffer.toString('base64'))
  ])(images);
  return Promise.all(
    base64images.map(async (image: string, index: number) => {
      const fullPath = path.resolve('./tmp', `artboard_${index}.png`);
      await fs.outputFile(fullPath, image, 'base64');
      return fullPath;
    })
  );
}
