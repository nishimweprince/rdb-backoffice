import { useState } from 'react';
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/states/store';
import { BusinessAmendmentRequestSummary } from './BusinessAmendmentReview';
import { capitalizeString, formatDate } from '@/helpers/strings.helper';

const CloseBusinessAmendmentReview = () => {
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
        <section className="w-full flex flex-col gap-3">
          <h1 className="uppercase text-primary font-semibold text-lg">
            Provided information
          </h1>
          <menu className='w-full grid grid-cols-2 gap-5'>
            <ul className='w-full flex items-center gap-1'>
                <p>Dissolution date:</p>
                <p>{formatDate((selectedBusinessAmendment as unknown as {
                    newValue: {
                        dissolutionDate: string;
                    }
                })?.newValue?.dissolutionDate)}</p>
            </ul>
            <ul className='w-full flex items-center gap-1'>
                <p>Dissolution reason:</p>
                <p>{capitalizeString((selectedBusinessAmendment as unknown as {
                    newValue: {
                        dissolutionReason: string;
                    }
                })?.newValue?.dissolutionReason)}</p>
            </ul>
            <ul className='w-full flex items-center gap-1'>
                <p>Resolution date:</p>
                <p>{formatDate((selectedBusinessAmendment as unknown as {
                    newValue: {
                        resolutionDate: string;
                    }
                })?.newValue?.resolutionDate)}</p>
            </ul>
            <ul className='w-full flex items-center gap-1'>
                <p>Resolution reason:</p>
                <p>{capitalizeString((selectedBusinessAmendment as unknown as {
                    newValue: {
                        resolutionReason: string;
                    }
                })?.newValue?.resolutionReason)}</p>
            </ul>
          </menu>
        </section>
      )}
    </main>
  );
};

export default CloseBusinessAmendmentReview;
