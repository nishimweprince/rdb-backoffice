import { capitalizeString, formatDate } from '@/helpers/strings.helper';
import { Business } from '@/types/models/business';
import { Row } from '@tanstack/react-table';

export const businessColumns = [
  {
    id: 'companyName',
    header: 'Company Name',
    accessorKey: 'companyName',
    cell: ({ row }: { row: Row<Business> }) =>
      (
        row?.original?.companyName ||
        row?.original?.enterpriseName ||
        row?.original?.branchName
      )?.toUpperCase() || 'N/A',
  },
  {
    id: 'companyType',
    header: 'Company Type',
    accessorKey: 'companyType',
    cell: ({ row }: { row: Row<Business> }) =>
      capitalizeString(row.original.companyType),
  },
  {
    id: 'dateOfIncorporation',
    header: 'Date of Incorporation',
    accessorKey: 'dateOfIncorporation',
    cell: ({ row }: { row: Row<Business> }) =>
      formatDate(row?.original?.dateOfIncorporation) ||
      formatDate(row?.original?.createdAt),
  },
  {
    id: 'applicationStatus',
    header: 'Application status',
    accessorKey: 'applicationStatus',
    cell: ({ row }: { row: Row<Business> }) =>
      capitalizeString(row?.original?.applicationStatus),
    filterFn: (row: Row<unknown>, id: string, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'applicationType',
    header: 'Application type',
    accessorKey: 'service.name',
    cell: ({ row }: { row: Row<Business> }) =>
      capitalizeString(row?.original?.service?.name),
    filterFn: (row: Row<unknown>, id: string, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'assignee',
    header: 'Assigned To',
    accessorKey: 'assignee',
  },
];

export const attachmentColumns = [
  {
    header: 'File Name',
    accessorKey: 'fileName',
  },
  {
    header: 'Attachment Type',
    accessorKey: 'attachmentType',
  },
  {
    header: 'Attachment Size',
    accessorKey: 'size',
  },
];

// MANAGEMENT PEOPLE COLUMNS
export const businessPeopleColumns = [
  {
    header: 'Position',
    accessorKey: 'position',
  },
  {
    header: 'Document No',
    accessorKey: 'personDocNo',
  },
  {
    header: 'First name',
    accessorKey: 'firstName',
  },
  {
    header: 'Last name',
    accessorKey: 'lastName',
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Phone number',
    accessorKey: 'phoneNumber',
  },
  {
    header: 'Sex',
    accessorKey: 'gender',
  },
  {
    header: 'Nationality',
    accessorKey: 'nationality',
  },
];

export const founderDetailColumns = [
  {
    header: 'Document Number',
    accessorKey: 'personDocNo',
  },
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Type',
    accessorKey: 'shareHolderType',
  },
  {
    header: 'Number of shares',
    accessorKey: 'shareQuantity',
  },
  {
    header: 'Total value',
    accessorKey: 'totalQuantity',
  },
];
