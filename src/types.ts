export interface AuditOverviewDto {
  id: string;
  action: string;
  status: string;
  startedAt: number;
  finishedAt: number;
  summary: string;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface PaginationQueryDto {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  action?: string;
  status?: string;
  summary?: string;
  startedAt?: number;
  finishedAt?: number;
}

export interface PaginationMetaDto {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedDto<TData> {
  data: TData[];
  meta: PaginationMetaDto;
}
