export type Picture = Omit<PictureWithProperXY, 'image'> & {
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
  image: string;
  x: string;
  y: string
  width: string;
  height: string;
};
