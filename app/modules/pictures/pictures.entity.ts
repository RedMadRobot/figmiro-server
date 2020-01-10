export type Picture = Omit<PictureFromClient, 'image'> & {
  fileName: string;
  imagePath: string;
};

export type PictureFromClient = {
  id: string;
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
