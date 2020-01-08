export type Picture = Omit<PictureStringed, 'image'> & {
  fileName: string;
  imagePath: string;
};

export type PictureBuffered = PictureStringed & {
  image: Buffer;
};

export type PictureStringed = {
  id: string;
  image: string;
  x: number;
  y: number;
  name: string,
  resourceId?: string;
};

export type WidgetWithFigmaId = {
  figmaId: string;
} & Widget;

export type Widget = {
  resourceId: string;
  name: string;
};
