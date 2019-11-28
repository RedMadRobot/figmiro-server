import {request} from 'utils/request';
import {pipe} from 'utils/pipe';
import {AuthInfo} from 'modules/auth';
import {CreateOrUpdatePictureDTO, CreateOrUpdatePicturesDTO} from './pictures.dto';

export async function createOrUpdatePictures(auth: AuthInfo, dto: CreateOrUpdatePicturesDTO): Promise<void> {
  await Promise.all(
    transformImages(dto.images).map(
      image => createOrUpdatePicture(auth, {boardId: dto.boardId, image})
    )
  );
}

export async function createOrUpdatePicture(auth: AuthInfo, dto: CreateOrUpdatePictureDTO): Promise<void> {
  try {
    await request.post(
      `/boards/${dto.boardId}/widgets`,
      {
        type: 'card',
        title: '<div style="background-color: #F00">developer card</div>',
        card: {
          customFields: [{
            value: 'lol',
            iconUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
          }]
        }
      },
      {
      headers: {
        Authorization: `${auth.tokenType} ${auth.accessToken}`
      }
    });
  } catch (e) {
    console.log(e);
  }
}

function transformImages(images: string): string[] {
  return pipe([
    JSON.parse,
    (data: object[]) => data.map(Object.values),
    (data: number[][]) => data.map(Buffer.from),
    (data: Buffer[]) => data.map(buffer => `data:image/png;name=frame.png;base64,${buffer.toString('base64')}`)
  ])(images);
}
