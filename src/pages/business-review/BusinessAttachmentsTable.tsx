import CustomPopover from '@/components/inputs/CustomPopover';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Table from '@/components/table/Table';
import { attachmentColumns } from '@/constants/business.constants';
import { BusinessAttachment } from '@/types/models/attachment';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
          <CustomPopover
            trigger={
              <menu className="w-full flex items-center justify-center cursor-pointer">
                <CustomTooltip label="Click to view actions">
                  <FontAwesomeIcon
                    className="text-primary cursor-pointer"
                    icon={faEllipsisVertical}
                  />
                </CustomTooltip>
              </menu>
            }
          >
            <menu className="bg-white flex flex-col gap-1 p-0 rounded-md">
              <Link
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
                to={row?.original?.attachmentUrl}
                target="_blank"
              >
                Open
              </Link>
              <Link
                rel="noopener noreferrer"
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="w-full flex items-center gap-2 text-[13px] text-center p-1 px-2 rounded-sm hover:bg-gray-100"
              >
                Download
              </Link>
            </menu>
          </CustomPopover>
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
