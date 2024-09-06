import { formatDateTime } from '@/helpers/strings.helper';
import { NameReservation } from '@/types/models/nameReservation';
import { Row } from '@tanstack/react-table';

export const nameReservationColumns = [
  {
    header: 'Code',
    accessorKey: 'code',
  },
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Renewal Count',
    accessorKey: 'renewalCount',
  },
  {
    header: 'Date Created',
    accessorKey: 'createdAt',
    cell: ({ row }: { row: Row<NameReservation> }) =>
      formatDateTime(row.original.createdAt),
  },
];
