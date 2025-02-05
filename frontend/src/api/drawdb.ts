import { request } from 'src/utils/request';
import { DatabasePostRequestPayload } from '../containers/Editor/models/database-request.dto';
import { DatabaseDetailResponse } from '../containers/Editor/models/database-response.dto';

export const getDatabaseDetail = (
  id: number,
): Promise<DatabaseDetailResponse> => {
  return request.get(`/drawdb/databases/${id}`);
};

export const getLastestDatabase = (): Promise<DatabaseDetailResponse> => {
  return request.get(`/drawdb/databases/latest`);
};

export const createDatabase = (
  data: DatabasePostRequestPayload,
): Promise<DatabaseDetailResponse> => {
  return request.post(`/drawdb/databases`, data);
};

export const updateDatabase = (
  id: number,
  data: Partial<DatabasePostRequestPayload>,
): Promise<DatabaseDetailResponse> => {
  return request.put(`/drawdb/databases/${id}`, data);
};

export const deleteDatabase = (id: number): Promise<any> => {
  return request.delete(`/drawdb/databases/${id}`);
};
