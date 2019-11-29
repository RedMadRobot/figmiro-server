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
    const data = {
      data: [
        {
          id: '1234',
          type: 'ImageWidget',
          json: '{}'
        }
      ]
    };
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

const exportPath = path.resolve();
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

// curl -v POST \
//   --header 'Content-Type: multipart/form-data' \
//   --header 'Authorization: hash q5HQmoqyRLUiNMOA1gpiEyF1dCZTOS0WM8JLsp45u4hWXFAyd8MRMyGVoMHukeIJ' \
//   -F 'GraphicsPluginRequest={"data":[{"id": "3074457345676563085","type": "ImageWidget","json": "{}"}]};type=application/json' \
//   -F 'ArtboardName1=@/Users/i.krupnov/Desktop/WRK/figma2miro-server/tmp/artboard_0.png' \
//   https://miro.com/api/v1/boards/o9J_kvjP1kA=/integrations/imageplugin
