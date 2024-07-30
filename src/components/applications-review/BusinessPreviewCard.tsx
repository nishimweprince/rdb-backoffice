import { Link } from 'react-router-dom';
import { businessId } from '@/types/models/business';
import { UUID } from 'crypto';
import { ReactNode } from 'react';

type BusinessPreviewCardProps = {
  header: string;
  children: ReactNode;
  businessId?: businessId;
  applicationStatus?: string;
  navigationFlowMassId?: UUID;
};

const BusinessPreviewCard = ({
  children,
  header,
}: BusinessPreviewCardProps) => {
  return (
    <section
      className={`flex flex-col w-full gap-3 p-4 rounded-md shadow-sm border-primary border-[.3px]`}
    >
      <menu className="flex items-center justify-between w-full gap-3">
        <Link
          to={'#'}
          onClick={(e) => {
            e.preventDefault();
          }}
          className="text-lg font-semibold uppercase text-primary"
        >
          {header}
        </Link>
      </menu>
      <section className="flex flex-col w-full gap-3 my-2">{children}</section>
    </section>
  );
};

export default BusinessPreviewCard;
