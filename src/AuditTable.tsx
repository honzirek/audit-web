import { useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
  type MRT_ColumnFiltersState,
  type MRT_Cell,
} from 'mantine-react-table';
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from './api';
import { type AuditOverviewDto, SortOrder } from './types';
import { format } from 'date-fns';

export const AuditTable = () => {
  //Manage MRT state that we need to pass to the API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //call our custom react-query hook
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: [
      'audit-logs',
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      // const fetchURL = new URL('/audit', 'http://localhost:3000'); // This is mocked here, actual call in api.ts
      
      const sortField = sorting.length > 0 ? sorting[0].id : undefined;
      const sortOrder = sorting.length > 0 ? (sorting[0].desc ? SortOrder.DESC : SortOrder.ASC) : undefined;
      
      const filters: Record<string, string> = {};
      columnFilters.forEach((filter) => {
          filters[filter.id] = filter.value as string;
      });

      return getAuditLogs({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sortField,
        sortOrder: sortOrder,
        action: filters['action'],
        status: filters['status'],
      });
    },
  });

  const columns = useMemo<MRT_ColumnDef<AuditOverviewDto>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: false,
      },
      {
        accessorKey: 'action',
        header: 'Action',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'summary',
        header: 'Summary',
        enableSorting: false,
      },
      {
        accessorKey: 'startedAt',
        header: 'Started At',
        Cell: ({ cell }: { cell: MRT_Cell<AuditOverviewDto> }) => format(new Date(cell.getValue<number>()), 'PPpp'),
      },
      {
        accessorKey: 'finishedAt',
        header: 'Finished At',
        Cell: ({ cell }: { cell: MRT_Cell<AuditOverviewDto> }) => {
            const val = cell.getValue<number>();
            return val ? format(new Date(val), 'PPpp') : '-';
        },
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data: data?.data ?? [],
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off client-side filtering
    manualPagination: true, //turn off client-side pagination
    manualSorting: true, //turn off client-side sorting
    mantineToolbarAlertBannerProps: isError
      ? {
          color: 'red',
          children: 'Error loading data',
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: data?.meta?.totalItems ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
  });

  return <MantineReactTable table={table} />;
};
