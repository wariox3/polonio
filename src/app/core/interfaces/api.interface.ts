export interface RespuestaApi<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export interface QueryParams {
  [key: string]: string | number;
}
