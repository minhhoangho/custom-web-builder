import { request } from '../utils/request';
import {
  BEVMetadataPayloadRequest,
  BEVPayloadRequest,
  CreateViewPointPayloadRequest,
  EditViewPointPayloadRequest,
  ListViewPointCameraPaginateResponse,
  ListViewPointPaginateResponse,
  UpsertCameraSourcePayloadRequest,
  ViewPointCameraData,
  ViewPointData,
  ViewPointPaginateRequest,
} from '../containers/GisMap/models';
import { PaginationQueryParams } from '../shared/models/requests';

export const listViewPointsPaginate = async ({
  pagination,
  keyword,
}: ViewPointPaginateRequest): Promise<ListViewPointPaginateResponse> => {
  const offsetParam = `offset=${pagination?.offset ?? ''}`;
  const limitParam = `limit=${pagination?.limit ?? ''}`;
  const keywordParam = `keyword=${keyword ?? ''}`;
  return request.get(
    `/gis-maps/view-points?${offsetParam}&${limitParam}&${keywordParam}`,
  );
};

export const createViewPoint = async (
  data: CreateViewPointPayloadRequest,
): Promise<ViewPointData> => {
  return request.post('/gis-maps/view-points', data);
};

export const updateViewPoint = async (
  id: number,
  data: EditViewPointPayloadRequest,
) => {
  return request.put(`/gis-maps/view-points/${id}`, data);
};

export const getDetailViewPoint = async (
  id: number,
): Promise<ViewPointData> => {
  return request.get(`/gis-maps/view-points/${id}`);
};

export const deleteViewPoint = async (id: number) => {
  return request.delete(`/gis-maps/view-points/${id}`);
};

export const getListViewPointCameras = async (
  id: number,
  pagination: PaginationQueryParams,
): Promise<ListViewPointCameraPaginateResponse> => {
  const offsetParam = `offset=${pagination?.offset ?? ''}`;
  const limitParam = `limit=${pagination?.limit ?? ''}`;
  return request.get(
    `/gis-maps/view-points/${id}/cameras?${offsetParam}&${limitParam}`,
  );
};

export const getViewPointCameraDetail = async (
  viewPointId: number,
  cameraId: number,
): Promise<ViewPointCameraData> => {
  return request.get(`/gis-maps/view-points/${viewPointId}/camera/${cameraId}`);
};

export const upsertNewViewPointCamera = async (
  viewpointId: number,
  payload: UpsertCameraSourcePayloadRequest,
) => {
  return request.post(`/gis-maps/view-points/${viewpointId}/camera`, payload);
};

export const saveBevImage = async (
  viewpointId: number,
  payload: BEVPayloadRequest,
) => {
  const data = {
    bevImage: payload.bevImage,
  };
  return request.post(
    `/gis-maps/view-points/${viewpointId}/camera/${payload.id}/bev`,
    data,
  );
};

export const saveBevMetadata = async (
  viewpointId: number,
  payload: BEVMetadataPayloadRequest,
) => {
  const data = {
    homographyMatrix: payload.homographyMatrix || [],
    imageCoordinates: payload.imageCoordinates,
  };
  return request.post(
    `/gis-maps/view-points/${viewpointId}/camera/${payload.id}/bev/metadata`,
    data,
  );
};

export const deleteViewPointCamera = async (
  viewpointId: number,
  camId: number,
): Promise<void> => {
  return request.delete(`/gis-maps/view-points/${viewpointId}/camera/${camId}`);
};
