import { useState } from 'react'
import BusinessAmendmentNavigation from './BusinessAmendmentNavigation';
import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { BusinessAmendmentRequestSummary } from './BusinessAmendmentReview';
import { formatDate } from '@/helpers/strings.helper';

const TransferOfRegistrationReview = () => {
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
        <section className='w-full flex flex-col gap-3'>
            <h1 className="uppercase text-primary font-semibold text-lg">
            Provided information
          </h1>
          <menu className='w-full grid grid-cols-2 gap-5'>
            <ul className='w-full flex flex-col gap-2'>
                <p className='uppercase text-primary font-medium underline'>Transfer reason:</p>
                <p>{(selectedBusinessAmendment as unknown as {
                    newValue: {
                        transferReason: string;
                    }
                })?.newValue?.transferReason}</p>
            </ul>
            <ul className='w-full flex items-center gap-1'>
                <p className='text-black font-normal'>Transfer date:</p>
                <p>{formatDate((selectedBusinessAmendment as unknown as {
                    newValue: {
                        transferDate: string;
                    }
                }).newValue.transferDate)}</p>
            </ul>
          </menu>
        </section>
      )}</main>
  )
}

export default TransferOfRegistrationReview;
