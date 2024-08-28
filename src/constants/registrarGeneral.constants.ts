import { capitalizeString, formatDate } from '@/helpers/strings.helper';
import { RegistrarGeneral } from '@/types/models/registrarGeneral';
import { Row } from '@tanstack/react-table';

export const registrarGeneralColumns = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }: { row: Row<RegistrarGeneral> }) =>
      `${row?.original?.parameterName}`,
  },
  {
    header: 'Position Label',
    accessorKey: 'positionLabel',
    cell: ({ row }: { row: Row<RegistrarGeneral> }) =>
      `${capitalizeString(row?.original?.parameterValue)}`,
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
    cell: ({ row }: { row: Row<RegistrarGeneral> }) =>
      formatDate(row?.original?.createdAt),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }: { row: Row<RegistrarGeneral> }) =>
      capitalizeString(row?.original?.status),
  },
  
];

