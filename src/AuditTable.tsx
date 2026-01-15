import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DateTimePicker, type DateValue } from '@mantine/dates';
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
import { ActionIcon } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';

interface AuditTableProps {
  onViewDetail: (id: string) => void;
  onRowSelected: (id: string) => void;
  selectedId: string | null;
}

export const AuditTable = ({ onViewDetail, onRowSelected, selectedId }: AuditTableProps) => {
  //Manage MRT state that we need to pass to the API
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<MRT_SortingState>([{ id: 'startedAt', desc: true }]);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('limit') || '10', 10);

  const pagination: MRT_PaginationState = {
    pageIndex: page - 1,
    pageSize,
  };

  const setPagination = (updaterOrValue: any) => {
    const newPagination = typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;
    
    setSearchParams((prev: URLSearchParams) => {
        const newParams = new URLSearchParams(prev);
        newParams.set('page', (newPagination.pageIndex + 1).toString());
        newParams.set('limit', newPagination.pageSize.toString());
        return newParams;
    });
  };

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
        startedAt: filters['startedAt'] ? Number(filters['startedAt']) : undefined,
        finishedAt: filters['finishedAt'] ? Number(filters['finishedAt']) : undefined,
      });
    },
  });

  const columns = useMemo<MRT_ColumnDef<AuditOverviewDto>[]>(
    () => [
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        enableColumnFilter: false,
        size: 50,
        Cell: ({ row }) => (
          <ActionIcon onClick={(e) => {
             e.stopPropagation();
             onViewDetail(row.original.id);
          }}>
            <IconEye size={16} />
          </ActionIcon>
        ),
      },
      {
        accessorKey: 'id',
        header: 'ID',
        enableSorting: false,
        enableColumnFilter: false,
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
        Filter: ({ column }) => (
          <DateTimePicker
            onChange={(date: DateValue) => {
              column.setFilterValue(date ? date.getTime() : undefined);
            }}
            value={column.getFilterValue() ? new Date(column.getFilterValue() as number) : null}
            placeholder="Filter by Started At"
            clearable
          />
        ),
        Cell: ({ cell }: { cell: MRT_Cell<AuditOverviewDto> }) =>
          format(new Date(cell.getValue<number>()), 'PPpp'),
      },
      {
        accessorKey: 'finishedAt',
        header: 'Finished At',
        Filter: ({ column }) => (
          <DateTimePicker
            onChange={(date: DateValue) => {
              column.setFilterValue(date ? date.getTime() : undefined);
            }}
            value={column.getFilterValue() ? new Date(column.getFilterValue() as number) : null}
            placeholder="Filter by Finished At"
            clearable
          />
        ),
        Cell: ({ cell }: { cell: MRT_Cell<AuditOverviewDto> }) => {
          const val = cell.getValue<number>();
          return val ? format(new Date(val), 'PPpp') : '-';
        },
      },
    ],
    [onViewDetail],
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
    mantineTableBodyRowProps: ({ row }) => ({
        onClick: () => onRowSelected(row.original.id),
        onDoubleClick: () => onViewDetail(row.original.id),
        style: {
            cursor: 'pointer',
            backgroundColor: selectedId === row.original.id ? 'var(--mantine-color-blue-light)' : undefined,
        },
    }),
  });

  return <MantineReactTable table={table} />;
};
