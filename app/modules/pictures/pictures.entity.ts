export type Picture = Omit<PictureStringed, 'image'> & {
  fileName: string;
  imagePath: string;
};

export type PictureStringed = PictureFromClient & {
  image: string;
};

export type PictureFromClient = {
  id: string;
  image: Uint8Array;
  x: number;
  y: number;
  name: string;
  resourceId?: string;
};

export type WidgetWithFigmaId = {
  figmaId: string;
} & Widget;

export type Widget = {
  resourceId: string;
  name: string;
};
