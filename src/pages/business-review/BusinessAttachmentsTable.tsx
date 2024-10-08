import CustomTooltip from '@/components/inputs/CustomTooltip';
import Table from '@/components/table/Table';
import { attachmentColumns } from '@/constants/business.constants';
import { BusinessAttachment } from '@/types/models/attachment';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

type BusinessAttachmentsTableProps = {
  businessAttachmentsList?: BusinessAttachment[];
};

const BusinessAttachmentsTable = ({
  businessAttachmentsList,
}: BusinessAttachmentsTableProps) => {
  // ATTACHMENT COLUMNS
  const attachmentExtendedColumns = [
    ...attachmentColumns,
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BusinessAttachment> }) => {
        return (
          <CustomTooltip label='Click to open attachment'>
            <Link
            rel="noopener noreferrer"
            className="w-full flex items-center text-primary underline gap-2 text-[13px] text-center p-1 px-2"
            to={row?.original?.attachmentUrl}
            onClick={(e) => {
              e.preventDefault();
              window.open(row?.original?.attachmentUrl, '_blank');
            }}
            target="_blank"
          >
            Open
          </Link>
          </CustomTooltip>
        );
      },
    },
  ];

  return (
    <section className="w-full flex flex-col gap-4">
      {(businessAttachmentsList ?? [])?.length < 0 ? (
        <section className="w-full flex items-center justify-center gap-4">
          <h1 className="text-lg font-semibold text-primary uppercase">
            No Attachments Found
          </h1>
        </section>
      ) : (
        <Table
          data={(businessAttachmentsList ?? [])?.map(
            (attachment: BusinessAttachment) => {
              return {
                ...attachment,
                fileName: String(attachment?.fileName || attachment?.name),
                attachmentType: String(
                  attachment?.attachmentType || attachment?.type
                ),
                attachmentUrl: String(
                  attachment?.attachmentUrl || attachment?.name
                ),
                size: String(attachment?.fileSize)
                  ? `${(+attachment.fileSize / (1024 * 1024)).toFixed(2)} MB`
                  : 'N/A',
              };
            }
          )}
          columns={attachmentExtendedColumns as ColumnDef<BusinessAttachment>[]}
        />
      )}
    </section>
  );
};

export default BusinessAttachmentsTable;
