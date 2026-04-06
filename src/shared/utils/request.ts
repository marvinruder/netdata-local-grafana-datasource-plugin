import { getBackendSrv } from '@grafana/runtime';

export interface ErrorResponse {
  statusCode: number;
  message: string;
}

type RequestParamType = {
  method: string;
  path: string;
  baseUrl: string;
  params?: Record<string, any>;
  data?: { [key: string]: any };
};

const request = async <T = any>({ method, path, baseUrl, params, data }: RequestParamType) => {
  const flattenedParams = Object.entries(params || {}).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value.join(',');
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
  return await getBackendSrv().datasourceRequest<T>({
    method,
    url: `${baseUrl}/base${path}`,
    params: flattenedParams,
    data,
  });
};

export const Get = async <T = any>({ path, baseUrl, params }: Pick<RequestParamType, 'path' | 'baseUrl' | 'params'>) => {
  return await request<T>({ method: 'GET', path, baseUrl, params });
};

export const Post = async <T = any>({ path, baseUrl, params, data }: Pick<RequestParamType, 'path' | 'baseUrl' | 'params' | 'data'>) => {
  return await request<T>({ method: 'POST', path, baseUrl, params, data });
};
