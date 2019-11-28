/* tslint:disable:no-any */
type FunctionType = (value: any) => any;
export const pipe = (functions: FunctionType[]) => (data: any) =>
  functions.reduce(
    (value: any, func: FunctionType) => func(value),
    data
  );
