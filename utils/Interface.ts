export enum HTTP {
  CREATE = 201,
  BAD = 400,
  UPDATE = 202,
  DELETE = 204,
  OK = 200,
}

export interface iError {
  name: string;
  message: string;
  success: boolean;
  status: HTTP;
}