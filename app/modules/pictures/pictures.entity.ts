export type Picture = Omit<PictureWithProperXY, 'image'> & {
  fileName: string;
  imagePath: string;
};

export type PictureWithProperXY = Omit<PictureStringed, 'width' | 'height'> & {
  x: number;
  y: number;
};

export type PictureBuffered = PictureStringed & {
  image: Buffer;
};

export type PictureStringed = {
  id: string;
  image: string;
  x: string;
  y: string
  width: string;
  height: string;
  resourceId?: string;
};

export type WidgetWithFigmaId = {
  figmaId: string;
} & Widget;

export type Widget = {
  resourceId: string;
  name: string;
};
