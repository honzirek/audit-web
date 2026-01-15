export interface AuditOverviewDto {
  id: string;
  action: string;
  status: string;
  startedAt: number;
  finishedAt: number;
  summary: string;
}

export interface RetryAttemptDto {
  attemptNo: number;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  statusCode: number;
  outcome: string;
  errorMessage: string;
  phase: string;
}

export interface AuditDetailDto extends AuditOverviewDto {
  totalDurationMs: number;
  totalAttempts: number;
  metadata: Record<string, string>;
  attempts: RetryAttemptDto[];
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
