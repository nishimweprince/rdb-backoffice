import { useState } from 'react';
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { BusinessAmendmentRequestSummary } from './BusinessAmendmentsReview';
import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { BusinessActivity } from '@/types/models/business';
import Table from '@/components/table/Table';
import { businessLineColumns } from '@/constants/business.constants';

const BusinessActivitiesAmendmentReview = () => {
  // STATE VARIABLES
  const [selectedTab, setSelectedTab] = useState('request-summary');
  const { selectedBusinessAmendment } = useSelector(
    (state: RootState) => state.businessAmendment
  );

  return (
    <main className="w-full flex flex-col gap-4">
      <BusinessAmendmentNavigation
        onSelectTab={(slug) => {
          setSelectedTab(slug);
        }}
      />
      {selectedTab === 'request-summary' && (
        <BusinessAmendmentRequestSummary
          businessAmendment={selectedBusinessAmendment}
        />
      )}
      {selectedTab === 'changes-requested' && (
        <menu className="w-full flex flex-col gap-4">
          <section className="w-full flex flex-col gap-4">
            <h3 className="uppercase text-primary text-lg font-medium">
              Existing business activities
            </h3>
            <p>
              <span className="underline font-semibold">
                Main business activity
              </span>
              :{' '}
              {
                (
                  selectedBusinessAmendment?.oldValue as unknown as {
                    mainBusinessActivity: string;
                  }
                )?.mainBusinessActivity
              }
            </p>
            <Table
              data={
                (
                  selectedBusinessAmendment?.oldValue as unknown as {
                    businessLine: BusinessActivity[];
                  }
                )?.businessLine
              }
              showPagination={false}
              columns={businessLineColumns}
            />
          </section>
          <section className="w-full flex flex-col gap-4">
            <h3 className="uppercase text-primary text-lg font-medium">
              New business activities
            </h3>
            <p>
              <span className="underline font-semibold">
                Main business activity
              </span>
              :{' '}
              {
                (
                  selectedBusinessAmendment?.oldValue as unknown as {
                    mainBusinessActivity: string;
                  }
                )?.mainBusinessActivity
              }
            </p>
            <Table
              data={
                (
                  selectedBusinessAmendment?.newValue as unknown as {
                    businessLine: BusinessActivity[];
                  }
                )?.businessLine
              }
              showPagination={false}
              columns={businessLineColumns}
            />
          </section>
        </menu>
      )}
    </main>
  );
};

export default BusinessActivitiesAmendmentReview;
