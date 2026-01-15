import type { PaginatedDto, AuditOverviewDto, PaginationQueryDto, AuditDetailDto } from './types';

const API_URL = '/api';

export async function getAuditLogs(params: PaginationQueryDto): Promise<PaginatedDto<AuditOverviewDto>> {
  const queryParams = new URLSearchParams();
  queryParams.append('page', params.page.toString());
  queryParams.append('limit', params.limit.toString());
  
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params.action) queryParams.append('action', params.action);
  if (params.status) queryParams.append('status', params.status);
  if (params.startedAt) queryParams.append('startedAt', params.startedAt.toString());
  if (params.finishedAt) queryParams.append('finishedAt', params.finishedAt.toString());
  
  // Note: Backend seems to expect specific DTO fields, check if they map directly to query params.
  // NestJS @Query() maps these.

  const response = await fetch(`${API_URL}/audit?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export async function getAuditLog(id: string): Promise<AuditDetailDto> {
  const response = await fetch(`${API_URL}/audit/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
