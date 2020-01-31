import fs from 'fs-extra';
import multer from 'multer';
import {isArray} from 'lodash';
import path from 'path';
import crypto from 'crypto';
import {INTERNAL_SERVER_ERROR} from 'http-status-codes';
import FormData from 'form-data';
import {AppError} from 'utils/AppError';
import {request} from 'utils/request';
import {RequestWithBody} from 'utils/RequestWithBody';
import {CreateOrUpdatePicturesDTO, CreateOrUpdatePicturesResponse} from './pictures.dto';
import {Picture, PictureFromClient, WidgetWithFigmaId} from './pictures.entity';

export async function createOrUpdatePictures(
  req: RequestWithBody<CreateOrUpdatePicturesDTO>
): Promise<WidgetWithFigmaId[]> {
  const pictures = getPictures(req.files as Express.Multer.File[], req.body);
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
            ...(req.body.scale === 'true' ? {scaleData: {scale: 0.5}} : {})
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

function getPictures(
  images: Express.Multer.File[],
  dto: CreateOrUpdatePicturesDTO
): Picture[] {
  return images.map((image, index) => ({
    ...JSON.parse(isArray(dto.imageMeta) ? dto.imageMeta[index] : dto.imageMeta) as PictureFromClient,
    fileName: image.filename,
    imagePath: image.path
  }));
}

async function removeImagesFromTmp(pictures: Picture[]): Promise<void> {
  await Promise.all(
    pictures.map(async pic => {
      await fs.remove(pic.imagePath);
    })
  );
}

const TMP_DIR = path.resolve('./tmp');
export const upload = multer({
  storage: multer.diskStorage({
    async destination(
      _: Express.Request,
      __: Express.Multer.File,
      cb: (error: (Error | null), filename: string) => void
    ): Promise<void> {
      await fs.ensureDir(TMP_DIR);
      cb(null, TMP_DIR);
    },
    filename(
      _: Express.Request,
      file: Express.Multer.File,
      cb: (error: (Error | null), filename: string) => void
    ): void {
      crypto.pseudoRandomBytes(16, (___: Error, raw: Buffer): void => {
        const extension = path.extname(file.originalname);
        const filename = path.basename(file.originalname, extension);
        cb(null, `${filename}__${raw.toString('hex')}__${extension}`);
      });
    }
  })
});
