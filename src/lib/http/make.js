import httpstat from 'httpstat';
import HttpRequest from './request';

export default async (request) => {
  if (request instanceof HttpRequest) {
    const method = { method: request.method };
    const params = [
      request.url,
      method,
      request.headers,
      request.data,
      request.form,
    ];
    const response = await httpstat(...params);
    return response;
  }
  throw new Error('request must be an instance of HttpRequest');
};