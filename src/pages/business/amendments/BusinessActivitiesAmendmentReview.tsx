import { useState } from 'react';
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { BusinessAmendmentRequestSummary } from './BusinessAmendmentsReview';
import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { BusinessActivity } from '@/types/models/business';

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
      {selectedTab === 'current-details' && (
        <section className="w-full flex flex-col gap-4">
          <h3 className="uppercase text-primary text-lg font-medium">
            Exsiting business activities
          </h3>
          {(
            selectedBusinessAmendment?.oldValue as unknown as {
              businessLine: BusinessActivity[];
            }
          )?.businessLine?.map(
            (businessLine: BusinessActivity, index: number) => {
              return (
                <article className="flex items-center gap-3" key={index}>
                  <p>{index + 1}.</p>
                  <ul className="flex items-center gap-2">
                    <p>{businessLine?.code}</p>-
                    <p>{businessLine?.description}</p>
                  </ul>
                </article>
              );
            }
          )}
        </section>
      )}
      {selectedTab === 'proposed-changes' && (
        <section className="w-full flex flex-col gap-4">
          <h3 className="uppercase text-primary text-lg font-medium">
            Proposed business activities
          </h3>
          {(
            selectedBusinessAmendment?.newValue as unknown as {
              businessLine: BusinessActivity[];
            }
          )?.businessLine?.map(
            (businessLine: BusinessActivity, index: number) => {
              return (
                <article className="flex items-center gap-3" key={index}>
                  <p>{index + 1}.</p>
                  <ul className="flex items-center gap-2">
                    <p>{businessLine?.code}</p>-
                    <p>{businessLine?.description}</p>
                  </ul>
                </article>
              );
            }
          )}
        </section>
      )}
    </main>
  );
};

export default BusinessActivitiesAmendmentReview;
