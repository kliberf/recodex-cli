import { createApiCallPromise } from './helpers';

export const authenticate = (username, password) =>
  createApiCallPromise({
    endpoint: '/login',
    method: 'GET',
    query: { username, password }
  });
