import { capitalizeString, formatDateTime } from '@/helpers/strings.helper';
import { BusinessAttachment } from '@/types/models/attachment';
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
    id: 'applicationType',
    header: 'Application type',
    accessorKey: 'service.name',
    filterFn: (row: Row<unknown>, id: string, value: string) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }: { row: Row<Business> }) =>
      capitalizeString(row?.original?.service?.name),
  },
  {
    header: 'Last updated',
    accessorKey: 'updatedAt',
    cell: ({ row }: { row: Row<Business> }) =>
      formatDateTime(row?.original?.updatedAt),
  },
  {
    id: 'assignedVerifier',
    header: 'Assigned Verifier',
    accessorKey: 'assignedVerifier',
    cell: ({ row }: { row: Row<Business> }) =>
      `${
        row?.original?.assignedVerifier?.firstName ||
        row?.original?.assignedVerifier?.username || '-'
      } ${row?.original?.assignedVerifier?.lastName || ''}`,
  },
  {
    id: 'assignedApprover',
    header: 'Assigned Approver',
    accessorKey: 'assignedApprover',
    cell: ({ row }: { row: Row<Business> }) =>
      `${
        row?.original?.assignedApprover?.firstName ||
        row?.original?.assignedApprover?.username ||
        '-'
      } ${row?.original?.assignedApprover?.lastName || ''}`,
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
    cell: ({ row }: { row: Row<BusinessAttachment> }) => `${row?.original?.attachmentType || 'N/A'}`,
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
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Document Number',
    accessorKey: 'personDocNo',
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

export const applicationReviewStatuses = [
  'SUBMITTED',
  'VERIFIED',
  'APPROVED',
  'REJECTED',
  'ACTIVE',
  'RESUBMITTED',
  'ACTION_REQUIRED',
  'AMENDMENT_SUBMITTED',
  'IN_REVIEW',
  'PENDING_DECISION',
];

export const businessLineColumns = [
  {
    header: 'Code',
    accessorKey: 'code',
  },
  {
    header: 'Description',
    accessorKey: 'description',
  },
];
