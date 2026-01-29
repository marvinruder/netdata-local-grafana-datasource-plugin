import { getBackendSrv } from '@grafana/runtime';

export interface ErrorResponse {
  statusCode: number;
  message: string;
}

type RequestParamType = {
  method: string;
  path: string;
  baseUrl: string;
  data?: { [key: string]: any };
};

const request = async <T = any>({ method, path, baseUrl, data }: RequestParamType) => {
  const result = await getBackendSrv().datasourceRequest<T>({
    method,
    url: `${baseUrl}/base${path}`,
    data,
  });

  return result;
};

export const Get = async <T = any>({ path, baseUrl }: Pick<RequestParamType, 'path' | 'baseUrl'>) => {
  return await request<T>({ method: 'GET', path, baseUrl });
};

export const Post = async <T = any>({ path, baseUrl, data }: Pick<RequestParamType, 'path' | 'baseUrl' | 'data'>) => {
  return await request<T>({ method: 'POST', path, baseUrl, data });
};
