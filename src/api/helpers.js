import statusCode from 'statuscode';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const API_BASE = process.env.API_BASE || 'http://localhost:4000/v1';
export const CALL_API = 'recodex-api/CALL';

const maybeShash = endpoint =>
  endpoint.indexOf('/') === 0 ? '' : '/';

const getUrl = endpoint =>
  API_BASE + maybeShash(endpoint) + endpoint;

const createFormData = (body) => {
  if (body) {
    const data = new FormData();
    Object.keys(body).map(key => {
      if (Array.isArray(body[key])) {
        body[key].map(item =>
          data.append(`${key}[]`, item));
      } else {
        data.append(key, body[key]);
      }
    });
    return data;
  }
};

const maybeQuestionMark = (endpoint, query) =>
  Object.keys(query).length === 0
    ? ''
    : endpoint.indexOf('?') === -1 ? '?' : '&';

const generateQuery = query =>
  !query ? '' : Object.keys(query).map(key => `${key}=${query[key]}`).join('&');

export const assembleEndpoint = (endpoint, query = {}) =>
  endpoint + maybeQuestionMark(endpoint, query) + generateQuery(query);

const createRequest = (endpoint, query = {}, method, headers, body) =>
  fetch(getUrl(assembleEndpoint(endpoint, query)), {
    method,
    headers,
    body: createFormData(body)
  });

export const getHeaders = (headers, accessToken) => {
  if (accessToken) {
    return {
      ...headers,
      'Authorization': `Bearer ${accessToken}`
    };
  }

  return headers;
};

export const createApiCallPromise = ({
  endpoint,
  query = {},
  method = 'GET',
  headers = {},
  body = undefined
}) =>
  createRequest(endpoint, query, method, headers, body)
    .catch(err => {
      if (err.message && err.message === 'Failed to fetch') {
        throw new Error('Cannot communicate with the ReCodEx server.');
      } else {
        throw err;
      }
    })
    .then(res => res.json())
    .then(json => json.payload);
